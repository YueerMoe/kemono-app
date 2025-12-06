export function processHtmlText(htmlText: string): string {
    // 确保文本不是 null/undefined，并去除多余的空白行（初始清理）
    let result = htmlText.trim();

    // 0. 新增要求: 删除 downloads.fanbox.cc 的 a 标签
    // 匹配 <a ... href="..." downloads.fanbox.cc ...> ... </a>
    // [^>]*? 匹配 a 标签内的属性（非贪婪）
    // .*? 匹配 a 标签内的内容（非贪婪，包括换行）
    result = result.replace(
        /<a[^>]*?href\s*=\s*['"]?[^'"]*?downloads\.fanbox\.cc[^>]*?>.*?<\/a>/gis,
        ''
    );

    // 1. 删除 <h3>(frame embed)</h3>
    result = result.replace(/<h3>\s*\(frame embed\)\s*<\/h3>/gi, '');

    // 2. 没有文本或没有实际内容的 a 标签，将 href 作为其文本内容
    // 匹配 <a ... href="URL"></a> 或 <a ... href="URL"> </a> 等
    result = result.replace(
        /(<a[^>]*?href\s*=\s*['"]([^'"]+)['"][^>]*?>)\s*<\/a>/gi,
        (_, openingTag, href) => `${openingTag}${href}</a>`
    );

    // 3. 为 a 标签添加 onclick，内容为 handleLinkClick(href)
    // 匹配 <a...href="URL"...> 标签的起始部分，同时确保没有现存的 onclick
    // 使用负向后瞻 (?<!...) 确保没有已存在的 onclick 属性
    result = result.replace(
        /(<a[^>]*?href\s*=\s*['"]([^'"]+)['"][^>]*?)(?<!onclick\s*=\s*['"][^'"]*?)(?<!\sonclick)\s*([>])/gi,
        (_, attributesBeforeHref, href, closingBracket) => {
            // 确保 href URL 是经过编码的，以便在 JS 字符串中使用
            const safeHref = href.replace(/'/g, "\\'"); // 转义单引号
            const onclickAttribute = ` onclick="handleLinkClick('${safeHref}')"`;
            // 将 onclick 插入到 closingBracket 之前
            return `${attributesBeforeHref}${onclickAttribute}${closingBracket}`;
        }
    );

    // 4. 删除重复或空白的 div、p、span 等标签 (多次迭代清理)
    const tagsToClean = ['div', 'p', 'span'];
    tagsToClean.forEach(tag => {
        // 匹配 <tag> 或 <tag></tag> 或 <tag>空白</tag>
        const emptyTagRegex = new RegExp(`(<${tag}[^>]*?>\\s*<\/${tag}>)`, 'gi');

        let previousLength = -1;
        while (result.length !== previousLength) {
            previousLength = result.length;
            // 删除空的标签对
            result = result.replace(emptyTagRegex, '');
        }
    });

    // 5. 如 <p> 或 <div> 等标签内只有一个元素而不是文本，则去除
    const parentTags = ['p', 'div'];
    parentTags.forEach(parentTag => {
        // 匹配 <parentTag[^>]*?> (开始标签) (一个子元素) </parentTag> (结束标签)
        const singleChildRegex = new RegExp(
            `<${parentTag}[^>]*?>\\s*(<[^>]+?>.*?<\/[^>]+?>)\\s*<\/${parentTag}>`,
            'gis'
        );

        let previousLength = -1;
        while (result.length !== previousLength) {
            previousLength = result.length;
            // 替换为中间捕获到的子元素内容 ($1)
            result = result.replace(singleChildRegex, '$1');
        }
    });

    // 6. 如有连续的重复内容的标签，仅保留一个
    // 匹配 <tag(attr)>content</tag><tag(attr)>content</tag>
    const consecutiveDuplicateRegex = /<\s*(\w+)[^>]*?>\s*(.*?)\s*<\/\s*\1\s*>\s*<\s*\1[^>]*?>\s*\2\s*<\/\s*\1\s*>/gis;

    let previousLength = -1;
    while (result.length !== previousLength) {
        previousLength = result.length;
        // 替换为单个 <tag>$2</tag>
        result = result.replace(consecutiveDuplicateRegex, `<$1>$2</$1>`);
    }

    // 最终清理：删除连续的空行，去除首尾空白
    result = result.replace(/(\n\s*){2,}/g, '\n').trim();

    return result;
}
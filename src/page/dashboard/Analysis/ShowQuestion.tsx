import {Modal, Typography, TypographyParagraph} from "@arco-design/web-vue";

export function showFieldType() {
    Modal.open({
        title: "字段类型分析",
        content: () => <Typography>
            <TypographyParagraph>此功能可以帮助您对文本进行分析，展示文本分析器会对文本产生什么结果。</TypographyParagraph>
        </Typography>,
        draggable: true,
        footer: false
    })
}

export function showAnalyzer() {
    Modal.open({
        title: "分析器分析",
        content: () => <Typography>
            <TypographyParagraph>此功能可以帮助您对文本进行分析，展示文本分析器会对文本产生什么结果。</TypographyParagraph>
        </Typography>,
        draggable: true,
        footer: false
    })
}

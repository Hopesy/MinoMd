import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import mermaid from 'mermaid';
import html2canvas from 'html2canvas';
import {
    Bold,
    Italic,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Quote,
    Code,
    List,
    Link as LinkIcon,
    Unlink,
    Image as ImageIcon,
    Download,
    Upload,
    Eye,
    Edit3,
    Copy,
    Check,
    MessageSquare,
    Undo,
    Redo
} from 'lucide-react';

/**
 * 默认演示内容
 */
const DEFAULT_MARKDOWN = `# AI 发展趋势分析笔记

通过分析了 51 个开源模型，量化了一个现象：

* 模型能力倍增，呈现指数级增长，**检测周期约 3.5 个月**
* 这意味着达到同等性能水平，所需的参数量每 **3.5 个月减少一半**

---

### Densing Law (密度定律)

> **模型参数力总量，每 3.5 个月翻倍**

### 数学公式示例

行内公式：能量公式 $E = mc^2$，质能方程。

块级公式：

$$
\\frac{\\partial f}{\\partial x} = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}
$$

### 表格示例

| 模型名称 | 参数量 | 性能得分 |
|---------|-------|---------|
| GPT-4 | 1.8T | 95.2 |
| Claude | 175B | 92.8 |
| Llama | 70B | 88.5 |

### 流程图示例

\`\`\`mermaid
graph TD
    A[开始] --> B{判断条件}
    B -->|是| C[执行操作A]
    B -->|否| D[执行操作B]
    C --> E[结束]
    D --> E
\`\`\`

### 代码实现示例

\`\`\`python
# 计算模型密度的函数
def calculate_density(params, performance):
    """
    根据参数量和性能计算密度
    """
    if params <= 0:
        return 0

    density = performance / params
    print(f"Model Density: {density}")
    return density
\`\`\`
`;

// --- Atom One Dark 配色常量 ---
const AtomColors = {
    background: '#282c34',
    text: '#abb2bf',
    keyword: '#c678dd',
    function: '#61afef',
    string: '#98c379',
    number: '#d19a66',
    comment: '#5c6370',
    operator: '#56b6c2',
};

const FONT_FAMILY = 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace';

// --- 初始化 Mermaid ---
mermaid.initialize({
    startOnLoad: false,
    theme: 'neutral',
    securityLevel: 'loose',
});

// --- Mermaid 组件 ---
const MermaidBlock = ({ code }: { code: string }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>('');

    useEffect(() => {
        const renderDiagram = async () => {
            if (!code) return;
            try {
                const id = `mermaid-${Date.now()}`;
                const { svg } = await mermaid.render(id, code);
                setSvg(svg);
            } catch (err) {
                console.error('Mermaid render error:', err);
                setSvg(`<pre style="color: red;">流程图渲染错误</pre>`);
            }
        };
        renderDiagram();
    }, [code]);

    return (
        <section style={{ margin: '20px 0', textAlign: 'center' }}>
            <div 
                ref={containerRef}
                data-mermaid="true"
                dangerouslySetInnerHTML={{ __html: svg }}
                style={{ 
                    display: 'inline-block',
                    backgroundColor: '#ffffff',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                }}
            />
        </section>
    );
};

// --- 高亮逻辑 ---
const highlightCode = (code: string, _lang: string) => {
    if (!code) return [];
    const lines = String(code).replace(/\n$/, '').split('\n');

    return lines.map((line, lineIndex) => {
        let parts: React.ReactNode[] = [];
        let remaining = line;
        let key = 0;

        const patterns = [
            { type: 'comment', regex: /^(\/\/.*|#.*)/ },
            { type: 'string', regex: /^(['"`])(.*?)\1/ },
            { type: 'keyword', regex: /^\b(import|export|const|let|var|function|return|if|else|for|while|class|def|from|width)\b/ },
            { type: 'function', regex: /^\b([a-zA-Z_]\w*)(?=\()/ },
            { type: 'number', regex: /^\b\d+(\.\d+)?\b/ },
            { type: 'operator', regex: /^[\+\-\*\/=\<\>!&|]+/ },
            { type: 'text', regex: /^[\s\S]/ }
        ];

        while (remaining.length > 0) {
            let matched = false;
            const spaceMatch = remaining.match(/^\s+/);
            if (spaceMatch) {
                const spaces = spaceMatch[0].replace(/ /g, '\u00A0');
                parts.push(<span key={key++} style={{ fontFamily: FONT_FAMILY }}>{spaces}</span>);
                remaining = remaining.slice(spaceMatch[0].length);
                continue;
            }

            for (let { type, regex } of patterns) {
                const match = remaining.match(regex);
                if (match) {
                    const content = match[0];
                    let color = AtomColors.text;
                    let fontStyle = 'normal';

                    if (type === 'comment') { color = AtomColors.comment; fontStyle = 'italic'; }
                    else if (type === 'string') color = AtomColors.string;
                    else if (type === 'keyword') color = AtomColors.keyword;
                    else if (type === 'function') color = AtomColors.function;
                    else if (type === 'number') color = AtomColors.number;
                    else if (type === 'operator') color = AtomColors.operator;

                    parts.push(<span key={key++} style={{ color, fontStyle, fontFamily: FONT_FAMILY }}>{content}</span>);
                    remaining = remaining.slice(content.length);
                    matched = true;
                    break;
                }
            }

            if (!matched) {
                parts.push(<span key={key++} style={{ color: AtomColors.text, fontFamily: FONT_FAMILY }}>{remaining[0]}</span>);
                remaining = remaining.slice(1);
            }
        }

        return (
            <tr key={lineIndex} style={{ border: 'none', backgroundColor: 'transparent' }}>
                <td style={{ userSelect: 'none', textAlign: 'right', paddingRight: '8px', width: '1%', color: '#636d83', borderRight: '1px solid #3e4451', verticalAlign: 'top', fontFamily: FONT_FAMILY, fontSize: '13px', lineHeight: '1.5', whiteSpace: 'nowrap', backgroundColor: 'transparent' }}>{lineIndex + 1}</td>
                <td style={{ paddingLeft: '8px', verticalAlign: 'top', color: '#abb2bf', fontFamily: FONT_FAMILY, fontSize: '13px', lineHeight: '1.5', whiteSpace: 'pre', wordBreak: 'normal', backgroundColor: 'transparent' }}>{parts}</td>
            </tr>
        );
    });
};

// --- CodeBlock 组件 ---
const CodeBlock = ({ children }: { children: any }) => {
    const [copied, setCopied] = useState(false);

    if (!children || !children.props) return <pre style={{ background: '#f5f5f5', padding: '10px' }}>{children}</pre>;

    const { children: codeContent, className } = children.props;
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const codeString = String(codeContent).replace(/\n$/, '');

    const handleCopy = () => {
        navigator.clipboard.writeText(codeString).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => console.error('Copy failed', err));
    };

    return (
        <section style={{ marginTop: '20px', marginBottom: '20px', textAlign: 'left' }}>
            <table width="100%" border={0} cellSpacing="0" cellPadding="0" style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#282c34', borderCollapse: 'separate', borderSpacing: 0, boxShadow: '0 8px 16px -4px rgba(0,0,0,0.4)' }}>
                <tbody>
                    <tr>
                        <td style={{ backgroundColor: '#21252b', padding: '8px 12px', borderBottom: '1px solid #181a1f', lineHeight: '1' }}>
                            <table width="100%" border={0} cellSpacing="0" cellPadding="0">
                                <tbody>
                                    <tr>
                                        <td align="left" valign="middle" width="20%">
                                            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56', marginRight: '8px', verticalAlign: 'middle' }}></span>
                                            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e', marginRight: '8px', verticalAlign: 'middle' }}></span>
                                            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f', verticalAlign: 'middle' }}></span>
                                        </td>
                                        <td align="center" valign="middle" width="60%">
                                            <span style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'sans-serif', fontWeight: 'bold', textTransform: 'uppercase', verticalAlign: 'middle', display: 'inline-block' }}>{language || 'TEXT'}</span>
                                        </td>
                                        <td align="right" valign="middle" width="20%">
                                            <span onClick={handleCopy} style={{ cursor: 'pointer', display: 'inline-block', verticalAlign: 'middle' }}>
                                                {copied ? <Check size={14} color="#4ade80" /> : <Copy size={14} color="#6b7280" />}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ padding: '12px 0', backgroundColor: '#282c34' }}>
                            <div style={{ overflowX: 'auto', width: '100%' }}>
                                <table width="100%" border={0} cellSpacing="0" cellPadding="0" style={{ margin: 0, tableLayout: 'auto' }}>
                                    <tbody>{highlightCode(codeContent, language)}</tbody>
                                </table>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
    );
};

export default function App() {
    const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
    const [activeTab, setActiveTab] = useState('both');
    const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [syncScroll, setSyncScroll] = useState(true);

    const [history, setHistory] = useState([DEFAULT_MARKDOWN]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const historyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [imageMap, setImageMap] = useState<Record<string, string>>({});

    const fileInputRef = useRef<HTMLInputElement>(null); // 用于 Markdown 导入
    const imageInputRef = useRef<HTMLInputElement>(null); // 新增：用于图片上传
    const editorRef = useRef<HTMLTextAreaElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);
    const isScrolling = useRef<string | null>(null);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) setActiveTab('preview');
            else setActiveTab('both');
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const saveToHistory = useCallback((newContent: string) => {
        if (newContent === history[historyIndex]) return;
        if (historyTimeoutRef.current) clearTimeout(historyTimeoutRef.current);

        historyTimeoutRef.current = setTimeout(() => {
            setHistory(prev => {
                const newHistory = prev.slice(0, historyIndex + 1);
                newHistory.push(newContent);
                if (newHistory.length > 100) newHistory.shift();
                return newHistory;
            });
            setHistoryIndex(prev => Math.min(prev + 1, 99));
        }, 500);
    }, [history, historyIndex]);

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        setMarkdown(newText);
        saveToHistory(newText);
    };

    const saveHistoryImmediate = (newContent: string) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newContent);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const undo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setMarkdown(history[newIndex]);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setMarkdown(history[newIndex]);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                if (e.shiftKey) redo(); else undo();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                e.preventDefault();
                redo();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [historyIndex, history]);

    // --- 处理本地图片加载 (File -> Base64 -> imageMap) ---
    const processImageFile = (file: File | null) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                const fullDataUrl = e.target.result as string;
                const imageId = `img-upload-${Date.now()}`;

                // 存入 Map
                setImageMap(prev => ({ ...prev, [imageId]: fullDataUrl }));

                // 插入 Markdown 引用
                const newImageMarkdown = `![图片](local://${imageId})`;

                // 在光标位置插入
                const textarea = document.getElementById('editor-textarea') as HTMLTextAreaElement;
                if (textarea) {
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const text = textarea.value;
                    const newText = text.substring(0, start) + newImageMarkdown + text.substring(end);
                    setMarkdown(newText);
                    saveHistoryImmediate(newText);
                } else {
                    // 兜底：追加到末尾
                    setMarkdown(prev => prev + '\n' + newImageMarkdown);
                }
            }
        };
        reader.readAsDataURL(file);
    };

    // --- 粘贴事件监听 ---
    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                e.preventDefault(); // 阻止默认粘贴行为（防止粘贴文件名）
                const file = items[i].getAsFile();
                processImageFile(file);
                break; // 每次只处理一张
            }
        }
    };

    // --- 图片上传按钮点击 ---
    const handleImageUploadClick = () => {
        imageInputRef.current?.click();
    };

    // --- 图片文件选择回调 ---
    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        processImageFile(file || null);
        e.target.value = ''; // 重置 input
    };

    // SVG 转 Base64 图片（用于流程图）
    const svgToBase64Image = async (svgElement: SVGElement): Promise<{ base64: string; width: number; height: number }> => {
        return new Promise((resolve) => {
            const rect = svgElement.getBoundingClientRect();
            const width = rect.width || 400;
            const height = rect.height || 300;
            
            const clonedSvg = svgElement.cloneNode(true) as SVGElement;
            clonedSvg.setAttribute('width', String(width));
            clonedSvg.setAttribute('height', String(height));
            
            const svgData = new XMLSerializer().serializeToString(clonedSvg);
            const svgBase64 = btoa(unescape(encodeURIComponent(svgData)));
            const dataUrl = `data:image/svg+xml;base64,${svgBase64}`;
            
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                // 不使用 scale，保持原始尺寸
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, width, height);
                    ctx.drawImage(img, 0, 0, width, height);
                }
                resolve({ base64: canvas.toDataURL('image/png'), width, height });
            };
            img.onerror = () => {
                resolve({ base64: '', width: 0, height: 0 });
            };
            img.src = dataUrl;
        });
    };

    // 裁剪 canvas 空白区域
    const trimCanvas = (canvas: HTMLCanvasElement, padding: number): HTMLCanvasElement => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return canvas;
        
        const { width, height } = canvas;
        const imageData = ctx.getImageData(0, 0, width, height);
        const { data } = imageData;
        
        let top = 0, bottom = height - 1, left = 0, right = width - 1;
        
        // 找顶部边界
        findTop: for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                if (data[idx] < 250 || data[idx + 1] < 250 || data[idx + 2] < 250) {
                    top = y;
                    break findTop;
                }
            }
        }
        
        // 找底部边界
        findBottom: for (let y = height - 1; y >= 0; y--) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                if (data[idx] < 250 || data[idx + 1] < 250 || data[idx + 2] < 250) {
                    bottom = y;
                    break findBottom;
                }
            }
        }
        
        // 找左边界
        findLeft: for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const idx = (y * width + x) * 4;
                if (data[idx] < 250 || data[idx + 1] < 250 || data[idx + 2] < 250) {
                    left = x;
                    break findLeft;
                }
            }
        }
        
        // 找右边界
        findRight: for (let x = width - 1; x >= 0; x--) {
            for (let y = 0; y < height; y++) {
                const idx = (y * width + x) * 4;
                if (data[idx] < 250 || data[idx + 1] < 250 || data[idx + 2] < 250) {
                    right = x;
                    break findRight;
                }
            }
        }
        
        // 添加 padding
        top = Math.max(0, top - padding);
        bottom = Math.min(height - 1, bottom + padding);
        left = Math.max(0, left - padding);
        right = Math.min(width - 1, right + padding);
        
        const croppedWidth = right - left + 1;
        const croppedHeight = bottom - top + 1;
        
        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = croppedWidth;
        croppedCanvas.height = croppedHeight;
        const croppedCtx = croppedCanvas.getContext('2d');
        if (croppedCtx) {
            croppedCtx.fillStyle = '#ffffff';
            croppedCtx.fillRect(0, 0, croppedWidth, croppedHeight);
            croppedCtx.drawImage(canvas, left, top, croppedWidth, croppedHeight, 0, 0, croppedWidth, croppedHeight);
        }
        
        return croppedCanvas;
    };

    // 公式转 Base64 图片（通用函数）
    const formulaToBase64 = async (element: HTMLElement, isBlock: boolean): Promise<{ base64: string; width: number; height: number }> => {
        try {
            const scale = 2;
            
            // 克隆元素到临时容器
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.top = '0';
            container.style.backgroundColor = '#ffffff';
            container.style.padding = '20px'; // 足够大的 padding 确保内容完整
            container.style.display = 'inline-block';
            container.style.whiteSpace = 'nowrap';
            
            const clone = element.cloneNode(true) as HTMLElement;
            container.appendChild(clone);
            document.body.appendChild(container);
            
            // 等待渲染
            await new Promise(resolve => setTimeout(resolve, 50));
            
            const canvas = await html2canvas(container, {
                backgroundColor: '#ffffff',
                scale: scale,
                logging: false,
                useCORS: true,
            });
            
            document.body.removeChild(container);
            
            // 裁剪空白，块级公式保留更多 padding
            const padding = isBlock ? 8 : 4;
            const trimmedCanvas = trimCanvas(canvas, padding * scale);
            
            return { 
                base64: trimmedCanvas.toDataURL('image/png'), 
                width: trimmedCanvas.width / scale, 
                height: trimmedCanvas.height / scale 
            };
        } catch {
            return { base64: '', width: 0, height: 0 };
        }
    };

    const copyForWeChat = async () => {
        const previewElement = document.getElementById('preview-content-wechat');
        if (!previewElement) return;

        // ========== 第一步：处理公式和流程图，转成图片 ==========
        const svgReplacements: { svg: Element; img: HTMLImageElement; parent: Node }[] = [];
        const katexReplacements: { katex: Element; img: HTMLImageElement; parent: Node }[] = [];
        
        // 1. Mermaid 流程图 SVG 转图片（只选择 Mermaid 容器内的 SVG，排除图标）
        const mermaidContainers = previewElement.querySelectorAll('[data-mermaid]');
        for (const container of Array.from(mermaidContainers)) {
            const svg = container.querySelector('svg');
            if (svg) {
                const result = await svgToBase64Image(svg as SVGElement);
                if (result.base64 && svg.parentNode) {
                    const img = document.createElement('img');
                    img.src = result.base64;
                    img.style.width = `${result.width}px`;
                    img.style.height = `${result.height}px`;
                    img.style.maxWidth = '100%';
                    img.style.display = 'block';
                    img.style.margin = '0 auto';
                    svgReplacements.push({ svg, img, parent: svg.parentNode });
                    svg.parentNode.replaceChild(img, svg);
                }
            }
        }
        
        // 2. 块级公式转图片
        const katexDisplays = previewElement.querySelectorAll('.katex-display');
        for (const display of Array.from(katexDisplays)) {
            const el = display as HTMLElement;
            const result = await formulaToBase64(el, true);
            if (result.base64 && display.parentNode) {
                const img = document.createElement('img');
                img.src = result.base64;
                img.style.width = `${result.width}px`;
                img.style.height = `${result.height}px`;
                img.style.maxWidth = '100%';
                img.style.display = 'block';
                img.style.margin = '16px auto';
                katexReplacements.push({ katex: display, img, parent: display.parentNode });
                display.parentNode.replaceChild(img, display);
            }
        }
        
        // 3. 行内公式转图片（排除已处理的块级公式内的）
        const inlineKatex = previewElement.querySelectorAll('.katex:not(.katex-display .katex)');
        for (const katex of Array.from(inlineKatex)) {
            if (!katex.parentNode) continue;
            const el = katex as HTMLElement;
            const result = await formulaToBase64(el, false);
            if (result.base64 && katex.parentNode) {
                const img = document.createElement('img');
                img.src = result.base64;
                img.style.display = 'inline';
                img.style.verticalAlign = 'middle';
                img.style.width = `${result.width}px`;
                img.style.height = `${result.height}px`;
                katexReplacements.push({ katex, img, parent: katex.parentNode });
                katex.parentNode.replaceChild(img, katex);
            }
        }

        // ========== 第二步：获取 HTML 并处理微信兼容性 ==========
        let html = previewElement.innerHTML;
        
        // 移除微信不支持的 CSS 属性
        html = html.replace(/box-shadow:\s*[^;]+;?/gi, '');
        html = html.replace(/opacity:\s*[^;]+;?/gi, '');
        html = html.replace(/overflow:\s*hidden;?/gi, '');
        html = html.replace(/text-transform:\s*[^;]+;?/gi, '');
        html = html.replace(/user-select:\s*[^;]+;?/gi, '');
        html = html.replace(/-webkit-user-select:\s*[^;]+;?/gi, '');
        html = html.replace(/cursor:\s*[^;]+;?/gi, '');
        
        // rgba 转 hex
        html = html.replace(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/gi, (_, r, g, b) => {
            return '#' + [r, g, b].map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
        });
        
        // display: flex 转 display: block
        html = html.replace(/display:\s*flex;?/gi, 'display: block;');
        
        // 给 table/tr 添加 border:none 防止微信自动加边框
        html = html.replace(/<table([^>]*)style="([^"]*)"/gi, '<table$1style="$2 border:none;"');
        html = html.replace(/<table(?![^>]*style=)([^>]*)>/gi, '<table style="border:none;"$1>');
        html = html.replace(/<tr([^>]*)style="([^"]*)"/gi, '<tr$1style="$2 border:none;"');
        html = html.replace(/<tr(?![^>]*style=)([^>]*)>/gi, '<tr style="border:none;"$1>');
        // td: 保留行号列的右边框，只给其他边添加 none
        html = html.replace(/<td([^>]*)style="([^"]*)"/gi, '<td$1style="$2 border-top:none; border-bottom:none; border-left:none;"');
        html = html.replace(/<td(?![^>]*style=)([^>]*)>/gi, '<td style="border:none;"$1>');
        
        // 代码块：调整表头和代码行的紧凑度
        html = html.replace(/padding:\s*8px 12px;?/gi, 'padding: 4px 12px;');  // 表头 padding
        html = html.replace(/padding:\s*12px 0;?/gi, 'padding: 6px 0;');       // 代码区 padding
        html = html.replace(/line-height:\s*1\.5;?/gi, 'line-height: 1.3;');   // 行高
        
        // 清理空 style 和多余分号
        html = html.replace(/style="\s*"/gi, '');
        html = html.replace(/;\s*;/g, ';');

        // ========== 第三步：恢复原始 DOM ==========
        const restoreDOM = () => {
            // 恢复公式
            for (let i = katexReplacements.length - 1; i >= 0; i--) {
                const { katex, img, parent } = katexReplacements[i];
                if (img.parentNode === parent) {
                    parent.replaceChild(katex, img);
                }
            }
            // 恢复流程图
            for (let i = svgReplacements.length - 1; i >= 0; i--) {
                const { svg, img, parent } = svgReplacements[i];
                if (img.parentNode === parent) {
                    parent.replaceChild(svg, img);
                }
            }
        };

        // ========== 第四步：复制到剪贴板 ==========
        try {
            await navigator.clipboard.write([
                new ClipboardItem({
                    'text/html': new Blob([html], { type: 'text/html' }),
                    'text/plain': new Blob([previewElement.innerText], { type: 'text/plain' })
                })
            ]);
            setCopyStatus('success');
        } catch (err) {
            console.error('Clipboard API failed, falling back:', err);
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(previewElement);
            selection?.removeAllRanges();
            selection?.addRange(range);
            try {
                document.execCommand('copy');
                setCopyStatus('success');
            } catch (e) {
                console.error('Copy failed', e);
                setCopyStatus('error');
            }
            selection?.removeAllRanges();
        }
        
        // 恢复原始 DOM
        restoreDOM();
        
        setTimeout(() => setCopyStatus('idle'), 2000);
    };

    const handleScroll = (source: string) => {
        if (!syncScroll) return;

        const editor = editorRef.current;
        const preview = previewRef.current;
        if (!editor || !preview) return;
        if (isScrolling.current && isScrolling.current !== source) return;
        isScrolling.current = source;
        let percentage = 0;
        if (source === 'editor') {
            percentage = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
            preview.scrollTop = percentage * (preview.scrollHeight - preview.clientHeight);
        } else {
            percentage = preview.scrollTop / (preview.scrollHeight - preview.clientHeight);
            editor.scrollTop = percentage * (editor.scrollHeight - editor.clientHeight);
        }
        setTimeout(() => isScrolling.current = null, 100);
    };

    const insertText = (before: string, after = '') => {
        const textarea = document.getElementById('editor-textarea') as HTMLTextAreaElement;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const newText = text.substring(0, start) + before + text.substring(start, end) + after + text.substring(end);

        setMarkdown(newText);
        saveHistoryImmediate(newText);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, end + before.length);
        }, 0);
    };

    const handleImportClick = () => fileInputRef.current?.click();
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                const content = e.target.result as string;
                setMarkdown(content);
                saveHistoryImmediate(content);
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };
    const downloadMarkdown = () => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([markdown], { type: 'text/markdown' }));
        a.download = "notes.md";
        document.body.appendChild(a);
        a.click();
    };

    const processedMarkdown = markdown.replace(/<u>(.*?)<\/u>/g, '[$1](__underline__)');

    return (
        <div className="flex flex-col h-screen bg-gray-50 text-gray-800 font-sans">
            <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm z-10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-600 rounded-md flex items-center justify-center text-white font-bold text-lg">M</div>
                    <h1 className="text-xl font-bold text-gray-800 tracking-tight">MinoMd</h1>
                </div>

                <div className="flex items-center gap-2">
                    <div className="md:hidden flex bg-gray-100 rounded-lg p-1 mr-2">
                        <button onClick={() => setActiveTab('edit')} className={`p-2 rounded-md ${activeTab === 'edit' ? 'bg-white shadow text-orange-600' : 'text-gray-500'}`}><Edit3 size={18} /></button>
                        <button onClick={() => setActiveTab('preview')} className={`p-2 rounded-md ${activeTab === 'preview' ? 'bg-white shadow text-orange-600' : 'text-gray-500'}`}><Eye size={18} /></button>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".md,.txt,.markdown" className="hidden" />

                    {/* 新增：图片上传 Input (Hidden) */}
                    <input type="file" ref={imageInputRef} onChange={handleImageFileChange} accept="image/*" className="hidden" />

                    <button
                        onClick={() => setSyncScroll(!syncScroll)}
                        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border border-gray-200 rounded-md transition-all duration-200
              ${syncScroll ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-white text-gray-500 hover:text-gray-700'}
            `}
                        title={syncScroll ? "关闭滚动同步" : "开启滚动同步"}
                    >
                        {syncScroll ? <LinkIcon size={16} /> : <Unlink size={16} />}
                        <span className="hidden sm:inline">同步</span>
                    </button>

                    <button onClick={copyForWeChat} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 rounded-md transition-all duration-200 ${copyStatus === 'success' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-green-600'}`}>{copyStatus === 'success' ? <Check size={16} /> : <MessageSquare size={16} />}<span className="hidden sm:inline">{copyStatus === 'success' ? '已复制' : '复制'}</span></button>
                    <button onClick={handleImportClick} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:text-orange-600 transition-colors"><Upload size={16} /><span className="hidden sm:inline">导入</span></button>
                    <button onClick={downloadMarkdown} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors"><Download size={16} /><span className="hidden sm:inline">导出</span></button>
                </div>
            </header>

            <div className="flex items-center gap-1 px-4 py-2 bg-white border-b border-gray-200 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-1 mr-2 border-r border-gray-200 pr-2">
                    <ToolbarButton icon={<Undo size={18} />} onClick={undo} tooltip="撤销 (Ctrl+Z)" disabled={historyIndex <= 0} />
                    <ToolbarButton icon={<Redo size={18} />} onClick={redo} tooltip="重做 (Ctrl+Shift+Z)" disabled={historyIndex >= history.length - 1} />
                </div>
                <ToolbarButton icon={<Heading1 size={18} />} onClick={() => insertText('# ')} tooltip="一级标题" />
                <ToolbarButton icon={<Heading2 size={18} />} onClick={() => insertText('## ')} tooltip="二级标题" />
                <ToolbarButton icon={<Heading3 size={18} />} onClick={() => insertText('### ')} tooltip="三级标题" />
                <ToolbarButton icon={<Heading4 size={18} />} onClick={() => insertText('#### ')} tooltip="四级标题" />
                <div className="w-px h-6 bg-gray-200 mx-2" />
                <ToolbarButton icon={<Bold size={18} />} onClick={() => insertText('**', '**')} tooltip="粗体" />
                <ToolbarButton icon={<Italic size={18} />} onClick={() => insertText('*', '*')} tooltip="斜体" />
                <ToolbarButton icon={<span className="font-bold underline text-lg">U</span>} onClick={() => insertText('<u>', '</u>')} tooltip="下划线 (虚线样式)" />
                <ToolbarButton icon={<Quote size={18} />} onClick={() => insertText('> ')} tooltip="引用块" />
                <div className="w-px h-6 bg-gray-200 mx-2" />
                <ToolbarButton icon={<List size={18} />} onClick={() => insertText('- ')} tooltip="列表" />
                <ToolbarButton icon={<Code size={18} />} onClick={() => insertText('```python\n', '\n```')} tooltip="代码块" />
                <ToolbarButton icon={<LinkIcon size={18} />} onClick={() => insertText('[', '](url)')} tooltip="链接" />
                {/* 图片按钮：现在触发文件选择 */}
                <ToolbarButton icon={<ImageIcon size={18} />} onClick={handleImageUploadClick} tooltip="插入/粘贴图片" />
            </div>

            <main className="flex-1 flex overflow-hidden">
                <div className={`flex-1 bg-white flex flex-col transition-all duration-300 ${activeTab === 'preview' ? 'hidden' : 'block'}`}>
                    <textarea
                        ref={editorRef}
                        onScroll={() => handleScroll('editor')}
                        id="editor-textarea"
                        className="w-full h-full p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed text-gray-700 overflow-y-auto"
                        value={markdown}
                        onChange={handleContentChange}
                        onPaste={handlePaste} // 监听粘贴事件
                        placeholder="在此输入 Markdown 内容... (支持 Ctrl+V 粘贴图片)"
                        spellCheck={false}
                    />
                </div>
                <div className={`w-px bg-gray-200 hidden md:block ${activeTab === 'both' ? '' : 'hidden'}`} />
                <div ref={previewRef} onScroll={() => handleScroll('preview')} className={`flex-1 overflow-y-auto bg-[#FDFDFD] relative transition-all duration-300 ${activeTab === 'edit' ? 'hidden' : 'block'}`}>
                    {/* 使用独立的背景层，提高性能 */}
                    <div className="min-h-full relative">
                        <div className="absolute inset-0 pointer-events-none z-0 opacity-40" style={{ backgroundImage: `linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
                        <div id="preview-content-wechat" className="relative z-10 max-w-3xl mx-auto p-8 md:p-12 min-h-full" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            <ReactMarkdown 
                                urlTransform={(value) => value} 
                                remarkPlugins={[remarkGfm, remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                                components={{
                                h1: ({ node, ...props }) => <section style={{ textAlign: 'center', marginTop: '40px', marginBottom: '20px' }}><span style={{ display: 'inline-block', backgroundColor: '#C66E49', color: '#ffffff', padding: '10px 24px', borderRadius: '8px', fontSize: '20px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>{props.children}</span></section>,
                                h2: ({ node, ...props }) => <section style={{ textAlign: 'center', marginTop: '30px', marginBottom: '20px' }}><span style={{ display: 'inline-block', backgroundColor: '#C66E49', color: '#ffffff', padding: '8px 20px', borderRadius: '6px', fontSize: '17px', fontWeight: 'bold', opacity: 0.9 }}>{props.children}</span></section>,
                                h3: ({ node, ...props }) => <section style={{ marginTop: '30px', marginBottom: '15px', display: 'flex', alignItems: 'center', borderBottom: '1px dashed #C66E49', paddingBottom: '10px' }}><span style={{ display: 'inline-block', width: '4px', height: '20px', backgroundColor: '#ea580c', marginRight: '10px', borderRadius: '4px' }} /><span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>{props.children}</span></section>,
                                h4: ({ node, ...props }) => <section style={{ marginTop: '30px', marginBottom: '15px', display: 'flex', alignItems: 'center', borderBottom: '1px dashed #C66E49', paddingBottom: '10px' }}><span style={{ display: 'inline-block', width: '4px', height: '20px', backgroundColor: '#ea580c', marginRight: '10px', borderRadius: '4px' }} /><span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>{props.children}</span></section>,
                                p: ({ node, ...props }) => <section style={{ marginBottom: '16px', lineHeight: '1.8', fontSize: '16px', color: '#374151', textAlign: 'justify' }}>{props.children}</section>,
                                strong: ({ node, ...props }) => <strong style={{ color: '#c2410c', fontWeight: 'bold' }}>{props.children}</strong>,
                                ul: ({ node, ...props }) => <ul style={{ paddingLeft: '2em', marginBottom: '16px', listStyleType: 'disc', color: '#374151' }}>{props.children}</ul>,
                                ol: ({ node, ...props }) => <ol style={{ paddingLeft: '2em', marginBottom: '16px', listStyleType: 'decimal', color: '#374151' }}>{props.children}</ol>,
                                li: ({ node, ...props }) => <li style={{ marginBottom: '8px', lineHeight: '1.6' }}>{props.children}</li>,
                                blockquote: ({ node, ...props }) => <section style={{ borderLeft: '4px solid #fdba74', backgroundColor: '#fff7ed', padding: '15px', margin: '20px 0', borderRadius: '4px', color: '#666', fontStyle: 'italic' }}>{props.children}</section>,
                                img: ({ node, ...props }) => {
                                    let src = props.src;
                                    if (src && src.startsWith('local://')) {
                                        const imageId = src.replace('local://', '');
                                        src = imageMap[imageId] || src;
                                    }
                                    return <section style={{ textAlign: 'center', margin: '20px 0' }}><img style={{ maxWidth: '100%', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #f0f0f0' }} src={src} alt={props.alt} />{props.alt && props.alt !== 'AI配图' && <span style={{ display: 'block', fontSize: '13px', color: '#999', marginTop: '8px' }}>{props.alt}</span>}</section>;
                                },
                                hr: () => <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '30px 0' }} />,
                                // 表格样式
                                table: ({ node, ...props }) => (
                                    <section style={{ margin: '20px 0' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', border: '1px solid #e5e7eb' }}>{props.children}</table>
                                    </section>
                                ),
                                thead: ({ node, ...props }) => <thead>{props.children}</thead>,
                                tbody: ({ node, ...props }) => <tbody>{props.children}</tbody>,
                                tr: ({ node, ...props }) => <tr style={{ borderBottom: '1px solid #e5e7eb' }}>{props.children}</tr>,
                                th: ({ node, ...props }) => <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 'bold', color: '#ffffff', border: '1px solid #e5e7eb', backgroundColor: '#C66E49' }}>{props.children}</th>,
                                td: ({ node, ...props }) => <td style={{ padding: '12px 16px', border: '1px solid #e5e7eb', color: '#374151', backgroundColor: '#f9fafb' }}>{props.children}</td>,
                                // 代码块（包括 Mermaid）
                                pre: ({ children }: any) => {
                                    const codeElement = children as React.ReactElement<{ className?: string; children?: string }>;
                                    if (codeElement?.props?.className?.includes('language-mermaid')) {
                                        const code = String(codeElement.props.children || '').replace(/\n$/, '');
                                        return <MermaidBlock code={code} />;
                                    }
                                    return <CodeBlock>{children}</CodeBlock>;
                                },
                                code: ({ node, className, children, ...props }: any) => {
                                    // 行内代码
                                    if (!className) {
                                        return <code style={{ backgroundColor: '#f3f4f6', color: '#c2410c', padding: '2px 6px', borderRadius: '4px', fontSize: '14px', fontFamily: FONT_FAMILY, margin: '0 2px' }}>{children}</code>;
                                    }
                                    // 代码块内的 code 标签，保持原样
                                    return <code className={className} {...props}>{children}</code>;
                                },
                                a: ({ node, href, children, ...props }) => {
                                    if (href === '__underline__') return <span style={{ borderBottom: '2px dashed #8DE0B4', paddingBottom: '2px', textDecoration: 'none', color: 'inherit' }}>{children}</span>;
                                    return <a href={href} style={{ color: '#2563eb', textDecoration: 'underline', borderBottom: '1px solid rgba(37, 99, 235, 0.2)' }} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
                                }
                            }}
                            >
                                {processedMarkdown}
                            </ReactMarkdown>
                            <div className="h-24"></div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function ToolbarButton({ icon, onClick, tooltip, disabled }: { icon: React.ReactNode; onClick: () => void; tooltip: string; disabled?: boolean }) {
    return <button onClick={onClick} title={tooltip} disabled={disabled} className={`p-2 rounded-md transition-colors ${disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-orange-600 hover:bg-orange-50'}`}>{icon}</button>;
}

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
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

#### 这是一个四级标题示例
它现在的样式和三级标题完全一样（左侧竖条 + 下滑虚线）。

### 重点标记示例

我们需要特别关注以下数据：
<u>算力成本每 2.6 个月腰斩</u>，这意味着<u>个人开发者</u>的时代即将来临。

### 代码实现示例

以下是计算参数密度的 Python 脚本，展示 **Mac + Atom** 风格渲染：

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

# 主程序入口
current_params = 70000000000  # 70B
growth_rate = 2.4             # 指数增长率

final_density = calculate_density(current_params, growth_rate)
\`\`\`

前端 React 组件示例：

\`\`\`javascript
import React from 'react';

const AIModel = ({ name, params }) => {
  // 渲染模型信息卡片
  return (
    <div className="card">
      <h1>{name}</h1>
      <p>Params: {params}B</p>
    </div>
  );
};
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

// --- 高亮逻辑 ---
const highlightCode = (code: string, lang: string) => {
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
                <td style={{ userSelect: 'none', textAlign: 'right', paddingRight: '12px', width: '35px', minWidth: '35px', color: '#636d83', borderRight: '1px solid #3e4451', verticalAlign: 'top', fontFamily: FONT_FAMILY, fontSize: '13px', lineHeight: '1.5', whiteSpace: 'nowrap', backgroundColor: 'transparent' }}>{lineIndex + 1}</td>
                <td style={{ paddingLeft: '12px', verticalAlign: 'top', color: '#abb2bf', fontFamily: FONT_FAMILY, fontSize: '13px', lineHeight: '1.5', whiteSpace: 'pre', wordBreak: 'normal', backgroundColor: 'transparent' }}>{parts}</td>
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
                                <table width="100%" border={0} cellSpacing="0" cellPadding="0" style={{ margin: 0, tableLayout: 'fixed' }}>
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
    const historyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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

    const copyForWeChat = () => {
        const previewElement = document.getElementById('preview-content-wechat');
        if (!previewElement) return;
        const selection = window.getSelection();
        const range = document.createRange();

        // 选中整个容器
        range.selectNodeContents(previewElement);

        selection?.removeAllRanges();
        selection?.addRange(range);
        try {
            const successful = document.execCommand('copy');
            setCopyStatus(successful ? 'success' : 'error');
        } catch (err) {
            console.error('Copy failed', err);
            setCopyStatus('error');
        }
        selection?.removeAllRanges();
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
                            <ReactMarkdown urlTransform={(value) => value} components={{
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
                                hr: ({ node, ...props }) => <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '30px 0' }} />,
                                pre: CodeBlock,
                                code: ({ node, inline, className, children, ...props }) => <code style={{ backgroundColor: '#f3f4f6', color: '#c2410c', padding: '2px 6px', borderRadius: '4px', fontSize: '14px', fontFamily: FONT_FAMILY, margin: '0 2px' }} {...props}>{children}</code>,
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

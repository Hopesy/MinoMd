/**
 * 默认 Markdown 演示内容
 */

export const DEFAULT_MARKDOWN = `# AI 发展趋势分析笔记

通过分析了 51 个开源模型，量化了一个现象：

* 模型能力倍增,呈现指数级增长，**检测周期约 3.5 个月**
* 这意味着达到同等性能水平，所需的参数量每 **3.5 个月减少一半**

---

### Densing Law (密度定律)

> **模型参数力总量，每 3.5 个月翻倍**

### 数学公式示例

行内公式：能量公式 $E = mc^2$，质能方程。

块级公式：

$$
\\\\frac{\\\\partial f}{\\\\partial x} = \\\\lim_{h \\\\to 0} \\\\frac{f(x+h) - f(x)}{h}
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

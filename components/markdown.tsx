import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import 'katex/dist/katex.min.css'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { CopyBtn } from '@/components/copy-btn'
import 'highlight.js/styles/github-dark-dimmed.css'

function escapeBrackets(text?: string) {
  const pattern =
    /(```[\s\S]*?```|`.*?`)|\\\[([\s\S]*?[^\\])\\\]|\\\((.*?)\\\)/g
  return text?.replace(
    pattern,
    (match, codeBlock, squareBracket, roundBracket) => {
      if (codeBlock) {
        return codeBlock
      } else if (squareBracket) {
        return `$$${squareBracket}$$`
      } else if (roundBracket) {
        return `$${roundBracket}$`
      }
      return match
    }
  )
}

const getTextFromChildren = (children: React.ReactNode): string => {
  return React.Children.toArray(children)
    .map(child => {
      if (typeof child === 'string') {
        return child
      }
      if (React.isValidElement(child)) {
        const el = child as React.ReactElement<{ children?: React.ReactNode }>
        return getTextFromChildren(el.props.children)
      }
      return ''
    })
    .join('')
    .trim()
}

export const MarkdownRender = (config: { children: React.ReactNode }) => {
  return (
    <Markdown
      components={{
        code({ node, inlist, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          const language = match && match[1]

          if (!inlist) {
            const codeContent = getTextFromChildren(children)

            return (
              <div className="relative">
                <CopyBtn code={codeContent} />
                <code className={className} {...props}>
                  {children}
                </code>
              </div>
            )
          }

          return (
            <code className={className} {...props}>
              {children}
            </code>
          )
        }
      }}
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeRaw, rehypeKatex, rehypeHighlight]}
      {...config}
    >
      {escapeBrackets(config?.children as string)}
    </Markdown>
  )
}

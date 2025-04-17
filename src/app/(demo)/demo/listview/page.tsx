'use client'

import React, { useState } from 'react'
import { nestedData } from '~/lib/fakedata'

interface TreeNode {
  id: string
  name: string
  children?: TreeNode[]
}

function TreeNode({ node, level = 0 }: { node: TreeNode; level?: number }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasChildren = node.children && node.children.length > 0

  return (
    <div className="pl-4" style={{ marginLeft: `${level * 20}px` }}>
      <div
        className="flex items-center py-1 hover:bg-gray-100 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {hasChildren && (
          <span className="mr-2">
            {isExpanded ? '▼' : '▶'}
          </span>
        )}
        <span>{node.name}</span>
      </div>
      {isExpanded && hasChildren && (
        <div>
          {node.children?.map((child) => (
            <TreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Page() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">无限嵌套树状列表</h1>
      {nestedData.map((node) => (
        <TreeNode key={node.id} node={node} />
      ))}
    </div>
  )
}
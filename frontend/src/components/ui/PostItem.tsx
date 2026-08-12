import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from './Avatar'
import { TextArea } from './TextArea'
import { Button } from './Button'
import { Clock, MoreHorizontal, Trash2, Pencil, Check, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

interface PostItemProps {
  post: any
  authorName: string
  authorRole?: string
  authorAvatar?: string
  onDelete?: (id: string) => void
  onUpdate?: (id: string, newContent: string) => void
}

function MediaGrid({ mediaUrl }: { mediaUrl: string }) {
  let items: string[] = []
  try {
    const parsed = JSON.parse(mediaUrl)
    if (Array.isArray(parsed)) {
      items = parsed
    } else {
      items = [mediaUrl]
    }
  } catch {
    items = [mediaUrl]
  }

  if (items.length === 0) return null

  const renderItem = (url: string, index: number, isLast = false, extraCount = 0) => {
    const isVideo = url.match(/\.(mp4|webm|ogg)$/i)
    return (
      <div key={index} className="relative w-full h-full bg-graphite-950 flex items-center justify-center overflow-hidden">
        {isVideo ? (
          <video src={url} controls className="w-full h-full object-cover" />
        ) : (
          <img src={url} alt={`Attachment ${index + 1}`} className="w-full h-full object-cover" />
        )}
        {isLast && extraCount > 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none">
            <span className="text-white text-3xl font-display font-semibold">+{extraCount}</span>
          </div>
        )}
      </div>
    )
  }

  if (items.length === 1) {
    const isVideo = items[0].match(/\.(mp4|webm|ogg)$/i)
    return (
      <div className="mt-3 rounded-lg overflow-hidden border border-graphite-200 bg-graphite-50">
        {isVideo ? (
          <video src={items[0]} controls className="w-full h-auto max-h-[600px] object-contain" />
        ) : (
          <img src={items[0]} alt="Attachment" className="w-full h-auto max-h-[600px] object-cover" />
        )}
      </div>
    )
  }

  if (items.length === 2) {
    return (
      <div className="mt-3 rounded-lg overflow-hidden border border-graphite-200 grid grid-cols-2 gap-1 aspect-video">
        {items.map((url, i) => renderItem(url, i))}
      </div>
    )
  }

  if (items.length === 3) {
    return (
      <div className="mt-3 rounded-lg overflow-hidden border border-graphite-200 grid grid-cols-2 gap-1 aspect-square">
        <div className="col-span-1 row-span-2 h-full">
          {renderItem(items[0], 0)}
        </div>
        <div className="grid grid-rows-2 gap-1 col-span-1 h-full">
          {renderItem(items[1], 1)}
          {renderItem(items[2], 2)}
        </div>
      </div>
    )
  }

  const extraCount = items.length > 4 ? items.length - 4 : 0
  return (
    <div className="mt-3 rounded-lg overflow-hidden border border-graphite-200 grid grid-cols-2 grid-rows-2 gap-1 aspect-square">
      {items.slice(0, 4).map((url, i) => renderItem(url, i, i === 3, extraCount))}
    </div>
  )
}

export function PostItem({ post, authorName, authorRole, authorAvatar, onDelete, onUpdate }: PostItemProps) {
  const { appUser } = useAuth()
  const isOwner = post.user_id === appUser?.id
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(post.content)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  async function handleSave() {
    if (!editContent.trim()) return
    try {
      const { error } = await supabase.from('posts').update({ content: editContent }).eq('id', post.id)
      if (!error) {
        setIsEditing(false)
        if (onUpdate) onUpdate(post.id, editContent)
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this post?')) return
    try {
      const { error } = await supabase.from('posts').delete().eq('id', post.id)
      if (!error) {
        if (onDelete) onDelete(post.id)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="p-4 rounded-button bg-canvas/50 border border-graphite-100 flex gap-3 shrink-0 relative group">
      <Avatar name={authorName} src={authorAvatar} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <div className="flex flex-wrap items-baseline gap-2">
            <Link to={`/profile/${post.user_id}`} className="font-semibold text-sm text-graphite-950 hover:underline">
              {authorName}
            </Link>
            {authorRole && <span className="text-[10px] uppercase text-graphite-500">{authorRole}</span>}
            <span className="text-[10px] text-graphite-400 flex items-center gap-1">
              <Clock size={10} /> 
              {new Date(post.created_at).toLocaleDateString()}
            </span>
          </div>
          
          {isOwner && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1 rounded-full hover:bg-graphite-100 text-graphite-500 transition-colors border-none bg-transparent cursor-pointer"
              >
                <MoreHorizontal size={16} />
              </button>
              
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 w-32 bg-canvas border border-graphite-200 rounded-card shadow-lg overflow-hidden z-10 py-1">
                  <button 
                    onClick={() => { setIsEditing(true); setMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm text-graphite-700 hover:bg-graphite-50 flex items-center gap-2 border-none bg-transparent cursor-pointer"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => { handleDelete(); setMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm text-error hover:bg-error/10 flex items-center gap-2 border-none bg-transparent cursor-pointer"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {isEditing ? (
          <div className="flex flex-col gap-2 mt-2">
            <TextArea 
              value={editContent} 
              onChange={(e) => setEditContent(e.target.value)} 
              className="text-sm min-h-[80px]"
            />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => { setIsEditing(false); setEditContent(post.content); }}>
                <X size={14} /> Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={!editContent.trim()}>
                <Check size={14} /> Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-1">
            <p className="text-sm text-graphite-800 whitespace-pre-wrap">{post.content}</p>
            {post.media_url && <MediaGrid mediaUrl={post.media_url} />}
          </div>
        )}
      </div>
    </div>
  )
}

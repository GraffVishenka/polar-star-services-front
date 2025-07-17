import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-font-family';
import { Color } from '@tiptap/extension-color';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Youtube } from '@tiptap/extension-youtube';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  parentId: string | null;
  level: number;
  createdAt: string;
  updatedAt: string;
  images?: string[];
  isExpanded?: boolean;
}

const ContentEditor = ({ content, onUpdate }: { content: string; onUpdate: (content: string) => void }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontFamily,
      Color,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Youtube.configure({
        inline: false,
        controls: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
  });

  const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      if (input.files?.length) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          editor?.chain().focus().setImage({ src: reader.result as string }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const addYoutubeVideo = () => {
    const url = prompt('Enter YouTube URL');
    if (url) {
      editor?.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 480,
      });
    }
  };

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="editor-container">
      <div className="editor-toolbar">
        <select
          onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
          value={editor.getAttributes('textStyle').fontFamily || ''}
        >
          <option value="">Font</option>
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
        </select>

        <select
          onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
          value={editor.getAttributes('textStyle').fontSize || ''}
        >
          <option value="">Size</option>
          <option value="12px">Small</option>
          <option value="16px">Normal</option>
          <option value="24px">Large</option>
          <option value="36px">Huge</option>
        </select>

        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'is-active' : ''}
        >
          Underline
        </button>

        <input
          type="color"
          onInput={(e) => editor.chain().focus().setColor(e.currentTarget.value).run()}
          value={editor.getAttributes('textStyle').color || '#000000'}
        />

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        >
          H2
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
        >
          List
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
        >
          Left
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
        >
          Center
        </button>

        <button
          onClick={() => {
            const previousUrl = editor.getAttributes('link').href;
            const url = window.prompt('URL', previousUrl);

            if (url === null) return;
            if (url === '') {
              editor.chain().focus().extendMarkRange('link').unsetLink().run();
              return;
            }

            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
          }}
          className={editor.isActive('link') ? 'is-active' : ''}
        >
          Link
        </button>

        <button onClick={addImage}>Image</button>
        <button onClick={addYoutubeVideo}>YouTube</button>
      </div>

      <EditorContent editor={editor} className="editor-content" />
    </div>
  );
};

const KnowledgeBasePage: React.FC = () => {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    parentId: null as string | null,
    subParentId: null as string | null
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [parentSearch, setParentSearch] = useState('');
  const [subParentSearch, setSubParentSearch] = useState('');

  useEffect(() => {
    const mockData: KnowledgeItem[] = [
      {
        id: '1',
        title: 'О продукте',
        content: '<h1>Основная информация</h1><p>О нашем продукте</p>',
        parentId: null,
        level: 0,
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
        isExpanded: true
      },
      {
        id: '2',
        title: 'Установка',
        content: '<h2>Инструкции по установке</h2><ol><li>Скачайте пакет</li><li>Запустите установщик</li></ol>',
        parentId: '1',
        level: 1,
        createdAt: '2023-01-02',
        updatedAt: '2023-01-02',
        isExpanded: true
      }
    ];

    setItems(mockData);
    setSelectedItem(mockData[0]);
  }, []);

  const handleSelectItem = (item: KnowledgeItem) => {
    setSelectedItem(item);
    setIsEditing(false);
  };

  const handleEdit = () => {
    if (selectedItem) {
      setEditForm({
        title: selectedItem.title,
        content: selectedItem.content,
        parentId: selectedItem.parentId,
        subParentId: null
      });
      setIsEditing(true);
    }
  };

  const handleCreateNew = () => {
    setEditForm({
      title: '',
      content: '',
      parentId: null,
      subParentId: null
    });
    setIsEditing(true);
    setSelectedItem(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
      const collectIdsToDelete = (idToDelete: string, ids: Set<string>): Set<string> => {
        ids.add(idToDelete);
        items.forEach(item => {
          if (item.parentId === idToDelete && !ids.has(item.id)) {
            collectIdsToDelete(item.id, ids);
          }
        });
        return ids;
      };

      const idsToDelete = collectIdsToDelete(id, new Set());
      
      setItems(items.filter(item => !idsToDelete.has(item.id)));
      if (selectedItem && idsToDelete.has(selectedItem.id)) {
        setSelectedItem(null);
      }
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleExpand = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
    ));
  };

  const isDescendant = (parentId: string, childId: string): boolean => {
    if (childId === parentId) return true;
    
    const child = items.find(item => item.id === childId);
    if (!child || !child.parentId) return false;
    
    return isDescendant(parentId, child.parentId);
  };

  const getAvailableParents = (currentItem?: KnowledgeItem | null, search = ''): KnowledgeItem[] => {
    const filtered = items.filter(item => 
      item.level < 2 && 
      item.title.toLowerCase().includes(search.toLowerCase())
    );
    
    if (!currentItem) return filtered;
    
    return filtered.filter(item => 
      item.id !== currentItem.id && 
      !isDescendant(currentItem.id, item.id)
    );
  };

  const getAvailableSubParents = (parentId: string | null, search = ''): KnowledgeItem[] => {
    if (!parentId) return [];
    return items.filter(item => 
      item.parentId === parentId && 
      item.title.toLowerCase().includes(search.toLowerCase())
    );
  };

  const getChildren = (parentId: string | null) => {
    return items
      .filter(item => item.parentId === parentId)
      .sort((a, b) => a.title.localeCompare(b.title));
  };

  const renderTree = (parentId: string | null, currentLevel = 0) => {
    const children = getChildren(parentId);
    if (children.length === 0) return null;

    return (
      <ul className="tree-parent-list">
        {children.map(item => (
          <li key={item.id}>
            <div className="tree-item-header">
              {getChildren(item.id).length > 0 && (
                <button 
                  className={`toggle-button ${item.isExpanded ? 'expanded' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(item.id);
                  }}
                  aria-label={item.isExpanded ? 'Свернуть' : 'Развернуть'}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <path d="M4 9L8 6L4 3" stroke="currentColor" fill="none" strokeWidth="2"/>
                  </svg>
                </button>
              )}
              <div 
                className={`tree-item level-${item.level} ${selectedItem?.id === item.id ? 'active' : ''}`}
                onClick={() => handleSelectItem(item)}
              >
                {item.title}
                <div className="item-actions">
                  <button onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}>Удалить</button>
                </div>
              </div>
            </div>
            <div className={`tree-child-container ${item.isExpanded ? 'expanded' : ''}`}>
              {renderTree(item.id, currentLevel + 1)}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editForm.title.trim() === '') {
      alert('Заголовок не может быть пустым');
      return;
    }

    const now = new Date().toISOString();
    const parentId = editForm.subParentId || editForm.parentId;
    const parent = parentId ? items.find(item => item.id === parentId) : null;
    const newLevel = parent ? parent.level + 1 : 0;

    if (newLevel > 2) {
      alert('Максимальная вложенность - 2 уровня');
      return;
    }

    if (selectedItem && isEditing) {
      const updatedItems = items.map(item => 
        item.id === selectedItem.id 
          ? { 
              ...item, 
              title: editForm.title, 
              content: editForm.content,
              parentId,
              level: newLevel,
              updatedAt: now
            } 
          : item
      );
      setItems(updatedItems);
      setSelectedItem(updatedItems.find(item => item.id === selectedItem.id) || null);
    } else {
      const newItem: KnowledgeItem = {
        id: `item-${Date.now()}`,
        title: editForm.title,
        content: editForm.content,
        parentId,
        level: newLevel,
        createdAt: now,
        updatedAt: now
      };
      setItems([...items, newItem]);
      setSelectedItem(newItem);
    }

    setIsEditing(false);
    setParentSearch('');
    setSubParentSearch('');
  };

  return (
    <div className="knowledge-base-container">
      <div className="sidebar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Поиск по базе знаний..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="tree-container">
          {searchTerm ? (
            <ul>
              {filteredItems.map(item => (
                <li key={item.id}>
                  <div 
                    className={`tree-item level-${item.level} ${selectedItem?.id === item.id ? 'active' : ''}`}
                    onClick={() => handleSelectItem(item)}
                  >
                    {item.title}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            renderTree(null)
          )}
        </div>
        
        <button className="create-button" onClick={handleCreateNew}>
          Создать новую запись
        </button>
      </div>
      
      <div className="content-area">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="edit-form">
            <div className="form-group">
              <label>Заголовок:</label>
              <input
                type="text"
                name="title"
                value={editForm.title}
                onChange={handleFormChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Родительская тема:</label>
              <div className="searchable-select">
                <input
                  type="text"
                  placeholder="Поиск родительской темы..."
                  value={parentSearch}
                  onChange={(e) => setParentSearch(e.target.value)}
                />
                <select
                  name="parentId"
                  value={editForm.parentId || ''}
                  onChange={(e) => {
                    handleFormChange(e);
                    setEditForm(prev => ({ ...prev, subParentId: null }));
                  }}
                  size={5}
                >
                  <option value="">(Нет родительской темы)</option>
                  {getAvailableParents(selectedItem, parentSearch).map(item => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {editForm.parentId && (
              <div className="form-group">
                <label>Подтема:</label>
                <div className="searchable-select">
                  <input
                    type="text"
                    placeholder="Поиск подтемы..."
                    value={subParentSearch}
                    onChange={(e) => setSubParentSearch(e.target.value)}
                  />
                  <select
                    name="subParentId"
                    value={editForm.subParentId || ''}
                    onChange={handleFormChange}
                    size={5}
                  >
                    <option value="">(Нет подтемы)</option>
                    {getAvailableSubParents(editForm.parentId, subParentSearch).map(item => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            
            <div className="form-group">
              <label>Содержание:</label>
              <ContentEditor 
                content={editForm.content} 
                onUpdate={(content) => setEditForm({...editForm, content})} 
              />
            </div>
            
            <div className="form-actions">
              <button type="submit">Сохранить</button>
              <button type="button" onClick={() => setIsEditing(false)}>
                Отмена
              </button>
            </div>
          </form>
        ) : selectedItem ? (
          <div className="content-view">
            <div className="content-header">
              <h2>{selectedItem.title}</h2>
              <div className="content-actions">
                <button onClick={handleEdit}>Редактировать</button>
                <button onClick={() => handleDelete(selectedItem.id)}>Удалить</button>
              </div>
              <div className="content-meta">
                <span>Создано: {new Date(selectedItem.createdAt).toLocaleString()}</span>
                <span>Обновлено: {new Date(selectedItem.updatedAt).toLocaleString()}</span>
              </div>
            </div>
            
            <div 
              className="content-body" 
              dangerouslySetInnerHTML={{ __html: selectedItem.content }}
            />
          </div>
        ) : (
          <div className="empty-state">
            <h2>База знаний</h2>
            <p>Выберите запись из списка слева или создайте новую</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBasePage;
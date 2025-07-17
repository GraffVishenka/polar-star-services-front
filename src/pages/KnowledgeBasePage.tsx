import React, { useState, useEffect, useRef } from "react";

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

const KnowledgeBasePage: React.FC = () => {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    parentId: null as string | null,
    subParentId: null as string | null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [parentSearch, setParentSearch] = useState("");
  const [subParentSearch, setSubParentSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const mockData: KnowledgeItem[] = [
      {
        id: "1",
        title: "О продукте",
        content: "Основная информация о нашем продукте.",
        parentId: null,
        level: 0,
        createdAt: "2023-01-01",
        updatedAt: "2023-01-01",
        isExpanded: true,
      },
      {
        id: "2",
        title: "Установка",
        content: "Инструкции по установке продукта.",
        parentId: "1",
        level: 1,
        createdAt: "2023-01-02",
        updatedAt: "2023-01-02",
        isExpanded: true,
      },
      {
        id: "3",
        title: "Настройка",
        content: "Как настроить продукт после установки.",
        parentId: "1",
        level: 1,
        createdAt: "2023-01-03",
        updatedAt: "2023-01-03",
        images: ["https://via.placeholder.com/150"],
      },
      {
        id: "4",
        title: "Требования к системе",
        content: "Минимальные системные требования для работы продукта.",
        parentId: "2",
        level: 2,
        createdAt: "2023-01-04",
        updatedAt: "2023-01-04",
      },
      {
        id: "5",
        title: "FAQ",
        content: "Ответы на часто задаваемые вопросы.",
        parentId: null,
        level: 0,
        createdAt: "2023-01-05",
        updatedAt: "2023-01-05",
      },
      {
        id: "6",
        title: "Устранение неполадок",
        content: "Решение распространенных проблем.",
        parentId: "5",
        level: 1,
        createdAt: "2023-01-06",
        updatedAt: "2023-01-06",
      },
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
        subParentId: null,
      });
      setIsEditing(true);
    }
  };

  const handleCreateNew = () => {
    setEditForm({
      title: "",
      content: "",
      parentId: null,
      subParentId: null,
    });
    setIsEditing(true);
    setSelectedItem(null);
  };

  const handleDelete = (id: string) => {
  if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
    // Создаем Set для хранения ID элементов к удалению
    const idsToDelete = new Set([id]);
    
    // Функция для поиска всех потомков
    const findDescendants = () => {
      let foundNew = false;
      items.forEach(item => {
        if (item.parentId && idsToDelete.has(item.parentId) && !idsToDelete.has(item.id)) {
          idsToDelete.add(item.id);
          foundNew = true;
        }
      });
      return foundNew;
    };

    // Находим всех потомков рекурсивно
    while (findDescendants()) {}

    // Удаляем элементы
    setItems(items.filter(item => !idsToDelete.has(item.id)));
    if (selectedItem && idsToDelete.has(selectedItem.id)) {
      setSelectedItem(null);
    }
  }
};

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setEditForm((prev) => ({
          ...prev,
          content: `${prev.content}\n![image](${imageUrl})\n`,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleExpand = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
      )
    );
  };

  const isDescendant = (parentId: string, childId: string): boolean => {
    if (childId === parentId) return true;

    const child = items.find((item) => item.id === childId);
    if (!child || !child.parentId) return false;

    return isDescendant(parentId, child.parentId);
  };

  const getAvailableParents = (
    currentItem?: KnowledgeItem | null,
    search = ""
  ): KnowledgeItem[] => {
    // Получаем только элементы 0 и 1 уровня (основные темы и подтемы)
    const potentialParents = items.filter((item) => item.level < 2);

    // Исключаем текущий элемент и его потомков
    const filtered = currentItem
      ? potentialParents.filter(
          (item) =>
            item.id !== currentItem.id && !isDescendant(currentItem.id, item.id)
        )
      : potentialParents;

    // Фильтруем по поиску и исключаем элементы, которые сами являются подтемами
    return filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) &&
        (item.level === 0 || !item.parentId) // Только корневые темы или подтемы без родителей
    );
  };

  const getAvailableSubParents = (
    parentId: string | null,
    search = ""
  ): KnowledgeItem[] => {
    if (!parentId) return [];
    return items.filter(
      (item) =>
        item.parentId === parentId &&
        item.title.toLowerCase().includes(search.toLowerCase())
    );
  };

  const getChildren = (parentId: string | null) => {
    return items
      .filter((item) => item.parentId === parentId)
      .sort((a, b) => a.title.localeCompare(b.title));
  };

  const renderTree = (parentId: string | null, currentLevel = 0) => {
    const children = getChildren(parentId);
    if (children.length === 0) return null;

    return (
      <ul className="tree-parent-list">
        {children.map((item) => (
          <li key={item.id}>
            <div className="tree-item-header">
              {getChildren(item.id).length > 0 && (
                <button
                  className={`toggle-button ${
                    item.isExpanded ? "expanded" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(item.id);
                  }}
                  aria-label={item.isExpanded ? "Свернуть" : "Развернуть"}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <path
                      d="M4 9L8 6L4 3"
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              )}
              <div
                className={`tree-item level-${item.level} ${
                  selectedItem?.id === item.id ? "active" : ""
                }`}
                onClick={() => handleSelectItem(item)}
              >
                {item.title}
                <div className="item-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
            <div
              className={`tree-child-container ${
                item.isExpanded ? "expanded" : ""
              }`}
            >
              {renderTree(item.id, currentLevel + 1)}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContentWithImages = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("![image](") && line.endsWith(")")) {
        const imageUrl = line.substring(9, line.length - 1);
        return (
          <div key={i} className="content-image">
            <img src={imageUrl} alt="Вставленное изображение" />
          </div>
        );
      }
      return <p key={i}>{line}</p>;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editForm.title.trim() === "" || editForm.content.trim() === "") {
      alert("Заголовок и содержание не могут быть пустыми");
      return;
    }

    const now = new Date().toISOString();
    const parentId = editForm.subParentId || editForm.parentId;
    const parent = parentId ? items.find((item) => item.id === parentId) : null;
    const newLevel = parent ? parent.level + 1 : 0;

    if (newLevel > 2) {
      alert("Максимальная вложенность - 2 уровня");
      return;
    }

    if (selectedItem && isEditing) {
      const updatedItems = items.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              title: editForm.title,
              content: editForm.content,
              parentId,
              level: newLevel,
              updatedAt: now,
            }
          : item
      );
      setItems(updatedItems);
      setSelectedItem(
        updatedItems.find((item) => item.id === selectedItem.id) || null
      );
    } else {
      const newItem: KnowledgeItem = {
        id: `item-${Date.now()}`,
        title: editForm.title,
        content: editForm.content,
        parentId,
        level: newLevel,
        createdAt: now,
        updatedAt: now,
      };
      setItems([...items, newItem]);
      setSelectedItem(newItem);
    }

    setIsEditing(false);
    setParentSearch("");
    setSubParentSearch("");
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
              {filteredItems.map((item) => (
                <li key={item.id}>
                  <div
                    className={`tree-item level-${item.level} ${
                      selectedItem?.id === item.id ? "active" : ""
                    }`}
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
                  value={editForm.parentId || ""}
                  onChange={(e) => {
                    handleFormChange(e);
                    setEditForm((prev) => ({ ...prev, subParentId: null }));
                  }}
                  size={5}
                >
                  <option value="">(Нет родительской темы)</option>
                  {getAvailableParents(selectedItem, parentSearch).map(
                    (item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    )
                  )}
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
                    value={editForm.subParentId || ""}
                    onChange={handleFormChange}
                    size={5}
                  >
                    <option value="">(Нет подтемы)</option>
                    {getAvailableSubParents(
                      editForm.parentId,
                      subParentSearch
                    ).map((item) => (
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
              <textarea
                name="content"
                value={editForm.content}
                onChange={handleFormChange}
                required
                rows={10}
              />
            </div>

            <div className="form-group">
              <label>Добавить изображение:</label>
              <div className="image-upload">
                <button
                  type="button"
                  className="upload-button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  Загрузить изображение
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </div>
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
                <button onClick={() => handleDelete(selectedItem.id)}>
                  Удалить
                </button>
              </div>
              <div className="content-meta">
                <span>
                  Создано: {new Date(selectedItem.createdAt).toLocaleString()}
                </span>
                <span>
                  Обновлено: {new Date(selectedItem.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="content-body">
              {renderContentWithImages(selectedItem.content)}

              {selectedItem.images && selectedItem.images.length > 0 && (
                <div className="content-images">
                  {selectedItem.images.map((img, i) => (
                    <img key={i} src={img} alt={`Изображение ${i + 1}`} />
                  ))}
                </div>
              )}
            </div>
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

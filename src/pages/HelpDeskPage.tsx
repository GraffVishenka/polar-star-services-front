import React, { useState, useMemo } from "react";

interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: Date;
}

interface Attachment {
  id: string;
  name: string;
  size: number;
  url: string;
}

interface Ticket {
  id: string;
  number: number;
  title: string;
  description: string;
  theme: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  creator: string;
  department: string;
  room: string;
  createdAt: Date;
  deadline: Date;
  assignee: string;
  comments: Comment[];
  attachments: Attachment[];
}

const HelpDeskPage: React.FC = () => {
  // Моковые данные
  const initialTickets: Ticket[] = [
    {
      id: "1",
      number: 1,
      title: "Не работает принтер",
      description:
        "Принтер в кабинете 305 не печатает, хотя показывает, что подключен. Заправка картриджа была неделю назад.",
      theme: "Оборудование",
      status: "open",
      creator: "Иванов И.И.",
      department: "Бухгалтерия",
      room: "305",
      createdAt: new Date("2023-05-10"),
      deadline: new Date("2023-05-17"),
      assignee: "Петров П.П.",
      comments: [
        {
          id: "c1",
          author: "Петров П.П.",
          text: "Проверил принтер, требуется замена картриджа",
          createdAt: new Date("2023-05-11"),
        },
      ],
      attachments: [],
    },
    {
      id: "2",
      number: 2,
      title: "Установка ПО",
      description:
        "Требуется установить Microsoft Office для нового сотрудника в кабинете 412.",
      theme: "Программное обеспечение",
      status: "in_progress",
      creator: "Сидорова С.С.",
      department: "Отдел кадров",
      room: "412",
      createdAt: new Date("2023-05-12"),
      deadline: new Date("2023-05-15"),
      assignee: "Смирнов С.С.",
      comments: [],
      attachments: [
        {
          id: "a1",
          name: "Требования.pdf",
          size: 1024 * 1024 * 2,
          url: "#",
        },
      ],
    },
    {
      id: "3",
      number: 3,
      title: "Проблемы с интернетом",
      description:
        "В кабинете 210 периодически пропадает интернет-соединение. Проблема наблюдается последние 3 дня.",
      theme: "Сеть",
      status: "open",
      creator: "Кузнецов К.К.",
      department: "IT отдел",
      room: "210",
      createdAt: new Date("2023-05-15"),
      deadline: new Date("2023-05-16"),
      assignee: "",
      comments: [],
      attachments: [],
    },
    {
      id: "4",
      number: 4,
      title: "Настройка почты",
      description:
        "Новый сотрудник не может войти в корпоративную почту. Требуется настройка почтового клиента.",
      theme: "Почта",
      status: "resolved",
      creator: "Фёдорова Ф.Ф.",
      department: "Маркетинг",
      room: "501",
      createdAt: new Date("2023-05-08"),
      deadline: new Date("2023-05-10"),
      assignee: "Петров П.П.",
      comments: [
        {
          id: "c2",
          author: "Петров П.П.",
          text: "Почта настроена, проблема решена",
          createdAt: new Date("2023-05-09"),
        },
      ],
      attachments: [],
    },
    {
      id: "5",
      number: 5,
      title: "Замена монитора",
      description:
        "Монитор в кабинете 104 мерцает и искажает цвета. Требуется замена оборудования.",
      theme: "Оборудование",
      status: "closed",
      creator: "Алексеев А.А.",
      department: "Отдел продаж",
      room: "104",
      createdAt: new Date("2023-05-01"),
      deadline: new Date("2023-05-05"),
      assignee: "Смирнов С.С.",
      comments: [],
      attachments: [],
    },
  ];

  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [sortField, setSortField] = useState<keyof Ticket>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState<keyof Ticket>("title");

  const [newTicket, setNewTicket] = useState<
    Omit<Ticket, "id" | "number" | "createdAt" | "comments" | "attachments"> & {
      attachments: File[];
    }
  >({
    title: "",
    description: "",
    theme: "",
    status: "open",
    creator: "Текущий пользователь",
    department: "",
    room: "",
    deadline: new Date(),
    assignee: "",
    attachments: [],
  });

  const [newComment, setNewComment] = useState("");

  // Фильтрация и сортировка заявок
  const filteredAndSortedTickets = useMemo(() => {
    let result = [...tickets];

    // Поиск
    if (searchTerm) {
      result = result.filter((ticket) => {
        const value = ticket[searchField];
        if (typeof value === "string") {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false;
      });
    }

    // Сортировка
    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === "asc"
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return result;
  }, [tickets, searchTerm, searchField, sortField, sortDirection]);

  const createTicket = () => {
    const ticket: Ticket = {
      ...newTicket,
      id: Math.random().toString(36).substr(2, 9),
      number: tickets.length + 1,
      createdAt: new Date(),
      comments: [],
      attachments: newTicket.attachments.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file),
      })),
    };

    setTickets([...tickets, ticket]);
    setIsCreateModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNewTicket({
      title: "",
      description: "",
      theme: "",
      status: "open",
      creator: "Текущий пользователь",
      department: "",
      room: "",
      deadline: new Date(),
      assignee: "",
      attachments: [],
    });
  };

  const addComment = () => {
    if (!selectedTicket || !newComment.trim()) return;

    const comment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      author: "Текущий пользователь",
      text: newComment,
      createdAt: new Date(),
    };

    const updatedTickets = tickets.map((ticket) =>
      ticket.id === selectedTicket.id
        ? { ...ticket, comments: [...ticket.comments, comment] }
        : ticket
    );

    setTickets(updatedTickets);
    setSelectedTicket({
      ...selectedTicket,
      comments: [...selectedTicket.comments, comment],
    });
    setNewComment("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewTicket({
        ...newTicket,
        attachments: [...newTicket.attachments, ...Array.from(e.target.files)],
      });
    }
  };

  const removeAttachment = (index: number) => {
    const updatedAttachments = [...newTicket.attachments];
    updatedAttachments.splice(index, 1);
    setNewTicket({ ...newTicket, attachments: updatedAttachments });
  };

  // Проверка на просроченность заявки
  const isOverdue = (ticket: Ticket) => {
    return (
      new Date(ticket.deadline) < new Date() &&
      ticket.status !== "resolved" &&
      ticket.status !== "closed"
    );
  };

  // Форматирование даты
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Форматирование даты для input[type="date"]
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  // Форматирование размера файла
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} Б`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
  };

  // Получение текста статуса
  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "Открыта";
      case "in_progress":
        return "В работе";
      case "resolved":
        return "Решена";
      case "closed":
        return "Закрыта";
      default:
        return status;
    }
  };

  // Поля для сортировки и поиска
  const sortableFields = [
    { value: "number", label: "Номер" },
    { value: "title", label: "Название" },
    { value: "theme", label: "Тема" },
    { value: "status", label: "Статус" },
    { value: "creator", label: "Создатель" },
    { value: "department", label: "Отделение" },
    { value: "room", label: "Кабинет" },
    { value: "createdAt", label: "Дата создания" },
    { value: "deadline", label: "Дедлайн" },
    { value: "assignee", label: "Исполнитель" },
  ];

  return (
    <div className="helpdesk-container">
      <div className="helpdesk-header">
        <h1>HelpDesk - Учёт заявок</h1>
        <button
          className="create-ticket-btn"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Создать заявку
        </button>
      </div>

      {/* Панель поиска и сортировки */}
      <div className="controls-panel">
        <div className="search-control">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value as keyof Ticket)}
          >
            {sortableFields.map((field) => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Поиск..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchTerm("")}
            >
              ×
            </button>
          )}
        </div>

        <div className="sort-controls">
          <div className="sort-control">
            <label>Сортировка:</label>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as keyof Ticket)}
            >
              {sortableFields.map((field) => (
                <option key={field.value} value={field.value}>
                  {field.label}
                </option>
              ))}
            </select>
          </div>

          <div className="sort-direction-control">
            <label>Направление:</label>
            <select
              value={sortDirection}
              onChange={(e) =>
                setSortDirection(e.target.value as "asc" | "desc")
              }
            >
              <option value="asc">По возрастанию</option>
              <option value="desc">По убыванию</option>
            </select>
          </div>
        </div>
      </div>

      {/* Таблица заявок */}
      <div className="tickets-table-container">
        <table className="tickets-table">
          <thead>
            <tr>
              <th>№</th>
              <th>Название</th>
              <th>Тема</th>
              <th>Статус</th>
              <th>Создатель</th>
              <th>Отделение</th>
              <th>Кабинет</th>
              <th>Дата создания</th>
              <th>Дедлайн</th>
              <th>Исполнитель</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedTickets.map((ticket) => (
              <tr
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`${
                  selectedTicket?.id === ticket.id ? "selected" : ""
                } ${isOverdue(ticket) ? "overdue" : ""}`}
              >
                <td>{ticket.number}</td>
                <td>{ticket.title}</td>
                <td>{ticket.theme}</td>
                <td>
                  <span className={`status-badge ${ticket.status}`}>
                    {getStatusText(ticket.status)}
                  </span>
                </td>
                <td>{ticket.creator}</td>
                <td>{ticket.department}</td>
                <td>{ticket.room}</td>
                <td>{formatDate(ticket.createdAt)}</td>
                <td>{formatDate(ticket.deadline)}</td>
                <td>{ticket.assignee || "Не назначен"}</td>
              </tr>
            ))}
            {filteredAndSortedTickets.length === 0 && (
              <tr>
                <td colSpan={10} className="empty-table-message">
                  {searchTerm ? "Заявки не найдены" : "Нет созданных заявок"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Модальное окно создания заявки */}
      {isCreateModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Создание новой заявки</h2>
            <div className="form-group">
              <label>Название *</label>
              <input
                type="text"
                value={newTicket.title}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, title: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Описание *</label>
              <textarea
                value={newTicket.description}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, description: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Тема *</label>
              <select
                value={newTicket.theme}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, theme: e.target.value })
                }
                required
              >
                <option value="">Выберите тему</option>
                <option value="Оборудование">Оборудование</option>
                <option value="Программное обеспечение">
                  Программное обеспечение
                </option>
                <option value="Сеть">Сеть</option>
                <option value="Почта">Почта</option>
                <option value="Другое">Другое</option>
              </select>
            </div>
            <div className="form-group">
              <label>Отделение *</label>
              <input
                type="text"
                value={newTicket.department}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, department: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Кабинет *</label>
              <input
                type="text"
                value={newTicket.room}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, room: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Дедлайн *</label>
              <input
                type="date"
                value={formatDateForInput(newTicket.deadline)}
                onChange={(e) =>
                  setNewTicket({
                    ...newTicket,
                    deadline: new Date(e.target.value),
                  })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Исполнитель</label>
              <input
                type="text"
                value={newTicket.assignee}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, assignee: e.target.value })
                }
                placeholder="Введите имя исполнителя"
              />
            </div>
            <div className="form-group">
              <label>Прикреплённые файлы</label>
              <input type="file" multiple onChange={handleFileUpload} />
              <div className="attachments-preview">
                {newTicket.attachments.map((file, index) => (
                  <div key={index} className="attachment-item">
                    <span>{file.name}</span>
                    <button
                      onClick={() => removeAttachment(index)}
                      aria-label="Удалить файл"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Отмена
              </button>
              <button
                className="create-btn"
                onClick={createTicket}
                disabled={
                  !newTicket.title ||
                  !newTicket.description ||
                  !newTicket.theme ||
                  !newTicket.department ||
                  !newTicket.room
                }
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Детали заявки */}
      {selectedTicket && (
        <div className="modal-overlay">
          <div className="ticket-modal">
            <div className="ticket-header">
              <h2>
                Заявка #{selectedTicket.number}: {selectedTicket.title}
              </h2>
              <div className="ticket-header-right">
                {isOverdue(selectedTicket) && (
                  <span className="overdue-badge">ПРОСРОЧЕНО</span>
                )}
                <button
                  className="close-details-btn"
                  onClick={() => setSelectedTicket(null)}
                  aria-label="Закрыть"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="ticket-modal-content">
              <div className="ticket-meta">
                <div>
                  <strong>Тема:</strong> {selectedTicket.theme}
                </div>
                <div>
                  <strong>Статус:</strong>
                  <span className={`status-badge ${selectedTicket.status}`}>
                    {getStatusText(selectedTicket.status)}
                  </span>
                </div>
                <div>
                  <strong>Создатель:</strong> {selectedTicket.creator}
                </div>
                <div>
                  <strong>Отделение:</strong> {selectedTicket.department}
                </div>
                <div>
                  <strong>Кабинет:</strong> {selectedTicket.room}
                </div>
                <div>
                  <strong>Дата создания:</strong>{" "}
                  {formatDate(selectedTicket.createdAt)}
                </div>
                <div>
                  <strong>Дедлайн:</strong>{" "}
                  {formatDate(selectedTicket.deadline)}
                </div>
                <div>
                  <strong>Исполнитель:</strong>{" "}
                  {selectedTicket.assignee || "Не назначен"}
                </div>
              </div>

              <div className="ticket-description">
                <h3>Описание</h3>
                <p>{selectedTicket.description}</p>
              </div>

              <div className="ticket-attachments">
                <h3>Прикреплённые файлы</h3>
                {selectedTicket.attachments.length > 0 ? (
                  <div className="attachments-list">
                    {selectedTicket.attachments.map((attachment) => (
                      <a
                        key={attachment.id}
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="attachment-link"
                      >
                        {attachment.name} ({formatFileSize(attachment.size)})
                      </a>
                    ))}
                  </div>
                ) : (
                  <p>Нет прикреплённых файлов</p>
                )}
              </div>

              <div className="ticket-comments">
                <h3>Комментарии ({selectedTicket.comments.length})</h3>
                <div className="comments-list">
                  {selectedTicket.comments.length > 0 ? (
                    selectedTicket.comments.map((comment) => (
                      <div key={comment.id} className="comment">
                        <div className="comment-header">
                          <strong>{comment.author}</strong>
                          <span>{formatDate(comment.createdAt)}</span>
                        </div>
                        <div className="comment-text">{comment.text}</div>
                      </div>
                    ))
                  ) : (
                    <p>Пока нет комментариев</p>
                  )}
                </div>
                <div className="add-comment">
                  <textarea
                    placeholder="Добавить комментарий..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button onClick={addComment} disabled={!newComment.trim()}>
                    Отправить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpDeskPage;

/**
 * Telegram Export Parser Utilities
 * Parses result.json from Telegram's "Export Chat History" feature
 */

/**
 * Convert Telegram text_entities into Tiptap JSON content
 */
export function convertTelegramEntities(text, entities = []) {
  if (!entities || entities.length === 0) {
    return [{ type: 'text', text: typeof text === 'string' ? text : '' }];
  }

  // If text is an array of entity objects (Telegram format)
  if (Array.isArray(text)) {
    const nodes = [];
    for (const part of text) {
      if (typeof part === 'string') {
        if (part.trim()) nodes.push({ type: 'text', text: part });
      } else if (part.type) {
        const textContent = part.text || '';
        if (!textContent) continue;
        const marks = [];
        if (part.type === 'bold') marks.push({ type: 'bold' });
        else if (part.type === 'italic') marks.push({ type: 'italic' });
        else if (part.type === 'underline') marks.push({ type: 'underline' });
        else if (part.type === 'code') marks.push({ type: 'code' });
        else if (part.type === 'text_link' && part.href) marks.push({ type: 'link', attrs: { href: part.href } });
        else if (part.type === 'mention') marks.push({ type: 'code' });

        if (marks.length > 0) {
          nodes.push({ type: 'text', text: textContent, marks });
        } else if (part.type === 'pre') {
          // Pre blocks handled separately
          nodes.push({ type: 'text', text: textContent });
        } else {
          nodes.push({ type: 'text', text: textContent });
        }
      }
    }
    return nodes.length > 0 ? nodes : [{ type: 'text', text: '' }];
  }

  return [{ type: 'text', text: String(text) }];
}

/**
 * Convert a Telegram message's text into Tiptap document JSON
 */
export function messageToTiptapContent(message) {
  const text = message.text;
  const entities = message.text_entities || [];

  // Check if entire message is a code block (pre)
  const hasPreBlock = Array.isArray(text)
    ? text.some(t => t && t.type === 'pre')
    : entities.some(e => e.type === 'pre');

  const nodes = [];

  if (Array.isArray(text)) {
    // Group pre-blocks separately
    let currentPara = [];

    for (const part of text) {
      if (typeof part === 'string') {
        if (part.includes('\n')) {
          const lines = part.split('\n');
          lines.forEach((line, i) => {
            if (line) currentPara.push({ type: 'text', text: line });
            if (i < lines.length - 1) {
              if (currentPara.length) {
                nodes.push({ type: 'paragraph', content: [...currentPara] });
                currentPara = [];
              }
            }
          });
        } else if (part) {
          currentPara.push({ type: 'text', text: part });
        }
      } else if (part && part.type === 'pre') {
        if (currentPara.length) {
          nodes.push({ type: 'paragraph', content: [...currentPara] });
          currentPara = [];
        }
        nodes.push({
          type: 'codeBlock',
          attrs: { language: part.language || 'javascript' },
          content: [{ type: 'text', text: part.text || '' }],
        });
      } else if (part && part.type === 'bold') {
        currentPara.push({ type: 'text', text: part.text || '', marks: [{ type: 'bold' }] });
      } else if (part && part.type === 'italic') {
        currentPara.push({ type: 'text', text: part.text || '', marks: [{ type: 'italic' }] });
      } else if (part && part.type === 'underline') {
        currentPara.push({ type: 'text', text: part.text || '', marks: [{ type: 'underline' }] });
      } else if (part && part.type === 'code') {
        currentPara.push({ type: 'text', text: part.text || '', marks: [{ type: 'code' }] });
      } else if (part && part.type === 'text_link') {
        currentPara.push({ type: 'text', text: part.text || part.href || '', marks: [{ type: 'link', attrs: { href: part.href } }] });
      } else if (part && part.text) {
        currentPara.push({ type: 'text', text: part.text });
      }
    }

    if (currentPara.length) {
      nodes.push({ type: 'paragraph', content: currentPara });
    }
  } else {
    // Plain string
    const plainText = String(text || '');
    const lines = plainText.split('\n').filter(l => l.trim());
    lines.forEach(line => nodes.push({ type: 'paragraph', content: [{ type: 'text', text: line }] }));
  }

  if (nodes.length === 0) {
    nodes.push({ type: 'paragraph', content: [{ type: 'text', text: '' }] });
  }

  return { type: 'doc', content: nodes };
}

/**
 * Extract plain text from a message for search/preview
 */
export function extractPlainText(text) {
  if (!text) return '';
  if (typeof text === 'string') return text;
  if (Array.isArray(text)) {
    return text.map(t => (typeof t === 'string' ? t : t?.text || '')).join('');
  }
  return String(text);
}

/**
 * Extract topics from Telegram service messages
 * topic_created action marks the start of a new topic
 */
export function extractTopics(messages, groupName = 'Imported') {
  const topics = new Map();
  const topicForMessage = new Map();

  // Find all topic_created service messages
  messages.forEach(msg => {
    if (msg.type === 'service' && msg.action === 'topic_created') {
      const topicId = String(msg.id);
      const topicName = msg.action_parameters?.title || `Topic ${topicId}`;
      topics.set(topicId, {
        id: `imported-topic-${topicId}`,
        telegram_topic_id: topicId,
        name: topicName,
        icon: '📝',
        note_count: 0,
        progress: 0,
        is_pinned: false,
        last_activity_at: msg.date || new Date().toISOString(),
        sort_order: topics.size,
      });
    }
  });

  // Map regular messages to topics via reply_to_message_id
  messages.forEach(msg => {
    if (msg.type === 'message') {
      const replyId = String(msg.reply_to_message_id || '');
      if (replyId && topics.has(replyId)) {
        topicForMessage.set(String(msg.id), replyId);
      } else {
        // Check if the reply chain leads to a topic
        // Default to first topic if no reply
        const firstTopicId = topics.keys().next().value;
        if (firstTopicId) topicForMessage.set(String(msg.id), firstTopicId);
      }
    }
  });

  return { topics, topicForMessage };
}

/**
 * Map messages to their topics and convert to note format
 */
export function mapMessagesToTopics(messages, topicForMessage) {
  const notesByTopic = {};

  messages.forEach(msg => {
    if (msg.type !== 'message') return;
    const text = extractPlainText(msg.text);
    if (!text.trim() && !msg.photo && !msg.file) return;

    const topicId = topicForMessage.get(String(msg.id));
    if (!topicId) return;

    const internalTopicId = `imported-topic-${topicId}`;
    if (!notesByTopic[internalTopicId]) notesByTopic[internalTopicId] = [];

    const content = messageToTiptapContent(msg);
    const lines = text.split('\n');
    const title = lines[0]?.slice(0, 80) || null;

    notesByTopic[internalTopicId].push({
      id: `imported-${msg.id}`,
      telegram_message_id: String(msg.id),
      title,
      content,
      content_text: text,
      is_pinned: false,
      is_starred: false,
      is_completed: false,
      is_deleted: false,
      progress: 0,
      review_status: 'not_started',
      difficulty: null,
      bg_color: null,
      tags: [],
      telegram_date: msg.date,
      created_at: msg.date || new Date().toISOString(),
      updated_at: msg.date_unixtime ? new Date(msg.date_unixtime * 1000).toISOString() : msg.date || new Date().toISOString(),
    });
  });

  return notesByTopic;
}

/**
 * Extract photo/file attachments from messages
 */
export function extractAttachments(messages) {
  const attachments = [];
  messages.forEach(msg => {
    if (msg.photo) {
      attachments.push({ messageId: String(msg.id), type: 'image', path: msg.photo });
    }
    if (msg.file) {
      attachments.push({ messageId: String(msg.id), type: 'file', path: msg.file, mime: msg.mime_type });
    }
  });
  return attachments;
}

/**
 * Main parser — takes raw result.json and returns structured data
 */
export function parseTelegramExport(json) {
  if (!json || !json.messages) {
    throw new Error('Invalid Telegram export format. Expected { messages: [...] }');
  }

  const groupName = json.name || json.title || 'Imported Group';
  const messages = json.messages || [];

  // Create a single category from this group
  const categoryId = `cat-imported-${Date.now()}`;
  const category = {
    id: categoryId,
    name: groupName,
    icon: '📥',
    color: '#ea580c',
    note_count: 0,
    sort_order: 999,
  };

  // Extract topics
  const { topics, topicForMessage } = extractTopics(messages, groupName);

  // If no topics found, create a default one
  if (topics.size === 0) {
    const defaultId = 'default';
    topics.set(defaultId, {
      id: `imported-topic-default`,
      telegram_topic_id: defaultId,
      name: groupName,
      icon: '📝',
      note_count: 0,
      progress: 0,
      is_pinned: false,
      last_activity_at: new Date().toISOString(),
      sort_order: 0,
    });
    messages.forEach(msg => {
      if (msg.type === 'message') topicForMessage.set(String(msg.id), defaultId);
    });
  }

  // Map topics to category
  const topicList = Array.from(topics.values()).map(t => ({ ...t, category_id: categoryId }));
  const topicsByCategory = { [categoryId]: topicList };

  // Map messages to notes per topic
  const rawNotesByTopic = mapMessagesToTopics(messages, topicForMessage);

  // Re-key using internal topic IDs and set category_id
  const notesByTopic = {};
  Object.entries(rawNotesByTopic).forEach(([topicId, noteList]) => {
    const topic = topicList.find(t => t.id === topicId);
    if (topic) {
      notesByTopic[topicId] = noteList.map(n => ({ ...n, topic_id: topicId, category_id: categoryId }));
      topic.note_count = noteList.length;
    }
  });

  // Update category note count
  category.note_count = Object.values(notesByTopic).flat().length;

  return { categories: [category], topicsByCategory, notesByTopic };
}

export default parseTelegramExport;

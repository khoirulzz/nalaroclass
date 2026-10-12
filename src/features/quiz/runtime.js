export function resolveLiveSessionId(session) {
  return session?.id || session?.sessionId || null;
}

export function shuffledItemIds(items, random = Math.random) {
  const ids = (items || []).map((item) => item.id);
  for (let index = ids.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [ids[index], ids[target]] = [ids[target], ids[index]];
  }
  return ids;
}

export function initialiseArrangeAnswers(questions, currentAnswers, random = Math.random) {
  let changed = false;
  const nextAnswers = { ...currentAnswers };
  for (const question of questions || []) {
    if (question.type !== 'arrange' || Array.isArray(currentAnswers[question.id])) continue;
    nextAnswers[question.id] = shuffledItemIds(question.items, random);
    changed = true;
  }
  return changed ? nextAnswers : currentAnswers;
}

export function orderedQuestions(questions, questionOrder = []) {
  const items = Array.isArray(questions) ? questions : [];
  if (!Array.isArray(questionOrder) || !questionOrder.length) return items;
  const byId = new Map(items.map((question) => [question.id, question]));
  const ordered = questionOrder.map((id) => byId.get(id)).filter(Boolean);
  const seen = new Set(ordered.map((question) => question.id));
  return [...ordered, ...items.filter((question) => !seen.has(question.id))];
}

export function hasQuestionAnswer(question, value, touched = false) {
  if (question?.type === 'arrange') return Boolean(touched && Array.isArray(value) && value.length > 0);
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === 'object') return true;
  return value !== '' && value !== undefined && value !== null;
}

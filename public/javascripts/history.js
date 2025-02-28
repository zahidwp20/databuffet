const key = currentCourseId;
const visited = new Set(JSON.parse(localStorage.getItem(key) || "[]") || []);

if (key && currentLessonId) {
  if (!visited.has(currentLessonId)) {
    visited.add(currentLessonId);
    localStorage.setItem(key, JSON.stringify(Array.from(visited)));
  }
}

visited.forEach((v) => {
  document.querySelector(`#lesson_${v} .lesson-check`)?.classList.add("complete");
});

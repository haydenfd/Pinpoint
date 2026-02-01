const GEMINI_ORIGIN = "https://gemini.google.com";

/**
 * Navigates to a Gemini conversation and scrolls to the target turn.
 * Uses pushState for SPA-friendly routing where possible.
 */
export function navigateGemini(conversationId: string, turnId: string) {
  const targetPath = `/app/${conversationId}`;
  const fullUrl = `${GEMINI_ORIGIN}${targetPath}`;

  // 1. External Redirect: If we aren't on Gemini, go there.
  if (window.location.origin !== GEMINI_ORIGIN) {
    window.location.href = fullUrl;
    return;
  }

  // 2. Internal Navigation: Compare paths (stripping trailing slashes)
  const currentPath = window.location.pathname.replace(/\/$/, "");
  const normalizedTarget = targetPath.replace(/\/$/, "");

  if (currentPath !== normalizedTarget) {
    // Push state works better for SPAs to prevent full reload
    window.history.pushState({}, "", targetPath);
    // We still need to trigger the scroll after the app reacts
    setTimeout(() => scrollGemini(turnId), 500); 
  } else {
    scrollGemini(turnId);
  }
}

/**
 * Attempts to locate and center the target response element.
 */
function scrollGemini(turnId: string) {
  const el = document.getElementById(
    `model-response-message-content${turnId}`
  )

  if (!el) {
    retry(turnId)
    return
  }

  el.scrollIntoView({ behavior: "smooth", block: "center" })
  highlight(el)
}

/**
 * Retries locating the target element to allow for async DOM hydration.
 */
function retry(turnId: string, attempts = 10) {
  if (attempts <= 0) return

  setTimeout(() => {
    const el = document.getElementById(
      `model-response-message-content${turnId}`
    )

    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" })
      highlight(el)
    } else {
      retry(turnId, attempts - 1)
    }
  }, 300)
}

/**
 * Briefly highlights the target response for visibility.
 */
function highlight(el: HTMLElement) {
  const original = el.style.backgroundColor
  el.style.transition = "background-color 0.3s ease"
  el.style.backgroundColor = "rgba(253,224,71,0.35)"
  setTimeout(() => {
    el.style.backgroundColor = original || ""
  }, 3000)
}

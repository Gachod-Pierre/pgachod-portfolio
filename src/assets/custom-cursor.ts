export function initCustomCursor() {
  console.log('Initializing custom cursor...')

  const cursor = document.createElement('div')
  cursor.classList.add('custom-cursor')
  document.body.appendChild(cursor)

  // Désactivation du scroll
  function disableScroll() {
    document.body.style.overflow = 'hidden'
  }

  // Réactivation du scroll
  function enableScroll() {
    document.body.style.overflow = ''
  }

  // Cacher le curseur
  function hideCursor() {
    cursor.style.display = 'none' // Cacher le curseur
  }

  // Réafficher le curseur
  function showCursor() {
    cursor.style.display = 'block' // Réafficher le curseur
  }

  // Suivi de la position de la souris et gestion du curseur
  document.addEventListener('mousemove', (e) => {
    const cursorRect = cursor.getBoundingClientRect()
    const cursorSize = cursorRect.width // taille actuelle du curseur

    // Empêcher le curseur de dépasser les bords de l'écran
    const x = Math.max(0, Math.min(e.pageX - cursorSize / 2, window.innerWidth - cursorSize))
    const y = Math.max(0, Math.min(e.pageY - cursorSize / 2, window.innerHeight - cursorSize))

    cursor.style.top = `${y}px`
    cursor.style.left = `${x}px`

    disableScroll() // Désactiver le scroll lorsque la souris bouge
    showCursor() // Afficher le curseur lorsque la souris est dans la fenêtre
  })

  // Cacher le curseur lorsque la souris sort de la fenêtre
  document.addEventListener('mouseleave', () => {
    hideCursor() // Cacher le curseur
    enableScroll() // Réactiver le scroll quand la souris quitte la fenêtre
  })

  // Animation du curseur lors du clic
  document.addEventListener('click', (e) => {
    const cursorRect = cursor.getBoundingClientRect()

    // Vérification : si le curseur est trop proche des bords, limiter l'animation
    const isNearEdge =
      cursorRect.left < 20 ||
      cursorRect.right > window.innerWidth - 20 ||
      cursorRect.top < 20 ||
      cursorRect.bottom > window.innerHeight - 20

    if (!cursor.classList.contains('click-effect')) {
      if (!isNearEdge) {
        // Si pas proche du bord, exécuter l'animation normale
        cursor.classList.add('click-effect')
      } else {
        // Limiter l'animation si proche du bord
        cursor.classList.add('click-effect-limited')
      }

      setTimeout(() => {
        cursor.classList.remove('click-effect')
        cursor.classList.remove('click-effect-limited')
      }, 500)
    }
  })

  // Réactivation du scroll lorsque le mouvement de la souris s'arrête
  document.addEventListener('mouseup', () => {
    enableScroll() // Réactiver le scroll à la fin
  })
}

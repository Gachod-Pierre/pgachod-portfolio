export function initCustomCursor() {
  console.log('Initializing custom cursor...')

  const cursor = document.createElement('div')
  cursor.classList.add('custom-cursor')
  document.body.appendChild(cursor)

  // Désactivation du curseur natif globalement
  document.body.style.cursor = 'none'

  // Fonction pour cacher le curseur
  function hideCursor() {
    cursor.style.display = 'none'
  }

  // Fonction pour réafficher le curseur
  function showCursor() {
    cursor.style.display = 'block'
  }



  // Suivi de la position de la souris et gestion du curseur personnalisé
  document.addEventListener('mousemove', (e) => {
    const cursorRect = cursor.getBoundingClientRect()
    const cursorSize = cursorRect.width

    // Empêcher le curseur de dépasser les bords de l'écran
    const x = Math.max(0, Math.min(e.pageX - cursorSize / 2, window.innerWidth - cursorSize))
    const y = Math.max(0, Math.min(e.pageY - cursorSize / 2, window.innerHeight - cursorSize))

    cursor.style.top = `${y}px`
    cursor.style.left = `${x}px`

    // Toujours cacher le curseur natif
    document.body.style.cursor = 'none'

    showCursor() // Afficher le curseur personnalisé
  })

  // Cacher le curseur lorsque la souris sort de la fenêtre
  document.addEventListener('mouseleave', () => {
    hideCursor()
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
        cursor.classList.add('click-effect')
      } else {
        cursor.classList.add('click-effect-limited')
      }

      setTimeout(() => {
        cursor.classList.remove('click-effect')
        cursor.classList.remove('click-effect-limited')
      }, 500)
    }
  })

  // Réactiver le scroll lorsque le mouvement de la souris s'arrête
  document.addEventListener('mouseup', () => {
    document.body.style.overflow = '' // Réactiver le scroll
  })
}

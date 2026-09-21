import { describe, expect, it } from 'vitest'
import { checkFile, missingFileMessage } from './fileRules.js'

const file = (name, type, size = 1000) => ({ name, type, size })

describe('checkFile', () => {
  it('acepta imágenes y PDF con el formato correcto', () => {
    expect(checkFile(file('foto.PNG', 'image/png'), 'imagen')).toBe('')
    expect(checkFile(file('cv.pdf', 'application/pdf'), 'cv')).toBe('')
  })

  it('rechaza formatos que no corresponden', () => {
    expect(checkFile(file('cv.pdf', 'application/pdf'), 'imagen')).toMatch(/Formato no permitido/)
    expect(checkFile(file('foto.png', 'image/png'), 'cv')).toMatch(/Formato no permitido/)
    expect(checkFile(file('dibujo.svg', 'image/svg+xml'), 'imagen')).toMatch(/Formato no permitido/)
  })

  it('rechaza vacíos y archivos pesados', () => {
    expect(checkFile(file('a.png', 'image/png', 0), 'imagen')).toMatch(/vacío/)
    expect(checkFile(file('a.png', 'image/png', 6 * 1024 * 1024), 'imagen')).toMatch(/5 MB/)
    expect(checkFile(file('a.pdf', 'application/pdf', 11 * 1024 * 1024), 'cv')).toMatch(/10 MB/)
  })
})

describe('missingFileMessage', () => {
  const fields = [{ name: 'imagen_url', label: 'Imagen', type: 'imagen' }, { name: 'cv_url', label: 'CV', type: 'cv' }]

  it('pide la imagen obligatoria pero no el CV opcional', () => {
    expect(missingFileMessage(fields, { imagen_url: '', cv_url: '' })).toMatch(/Imagen/)
    expect(missingFileMessage(fields, { imagen_url: '/archivos/1', cv_url: '' })).toBe('')
  })
})

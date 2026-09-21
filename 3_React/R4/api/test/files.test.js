import test from 'node:test'
import assert from 'node:assert/strict'
import { detectMime, validateUpload } from '../src/utils/fileTypes.js'

const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0])
const jpg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0])
const gif = Buffer.from('GIF89a......')
const webp = Buffer.concat([Buffer.from('RIFF'), Buffer.from([0, 0, 0, 0]), Buffer.from('WEBPVP8 ')])
const pdf = Buffer.from('%PDF-1.7 contenido')
const b64 = (buffer) => buffer.toString('base64')

test('detecta el formato por los primeros bytes', () => {
  assert.equal(detectMime(png), 'image/png')
  assert.equal(detectMime(jpg), 'image/jpeg')
  assert.equal(detectMime(gif), 'image/gif')
  assert.equal(detectMime(webp), 'image/webp')
  assert.equal(detectMime(pdf), 'application/pdf')
  assert.equal(detectMime(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>')), null)
})

test('acepta imágenes válidas y un PDF como currículum', () => {
  for (const image of [png, jpg, gif, webp]) assert.equal(validateUpload({ tipo: 'imagen', nombre: 'a.png', contenido: b64(image) }).error, undefined)
  assert.equal(validateUpload({ tipo: 'cv', nombre: 'cv.pdf', contenido: b64(pdf) }).mime, 'application/pdf')
})

test('rechaza un PDF como imagen y una imagen como currículum', () => {
  assert.ok(validateUpload({ tipo: 'imagen', nombre: 'a.png', contenido: b64(pdf) }).error)
  assert.ok(validateUpload({ tipo: 'cv', nombre: 'cv.pdf', contenido: b64(png) }).error)
})

test('no se fía del nombre: un ejecutable renombrado a .png se rechaza', () => {
  assert.ok(validateUpload({ tipo: 'imagen', nombre: 'virus.png', contenido: b64(Buffer.from('MZ\x90\x00 ejecutable')) }).error)
})

test('rechaza SVG, vacíos, tipos inventados y archivos enormes', () => {
  assert.ok(validateUpload({ tipo: 'imagen', nombre: 'a.svg', contenido: b64(Buffer.from('<svg></svg>')) }).error)
  assert.ok(validateUpload({ tipo: 'imagen', nombre: 'a.png', contenido: '' }).error)
  assert.ok(validateUpload({ tipo: '__proto__', nombre: 'a.png', contenido: b64(png) }).error)
  assert.ok(validateUpload({ tipo: 'imagen', nombre: 'a.png', contenido: b64(Buffer.concat([png, Buffer.alloc(5 * 1024 * 1024)])) }).error)
})

test('limpia el nombre del archivo', () => {
  assert.equal(validateUpload({ tipo: 'imagen', nombre: '../../etc/foto.png', contenido: b64(png) }).nombre, '.._.._etc_foto.png')
})

test('el favicon acepta ICO y PNG pero no PDF ni archivos de más de 1 MB', () => {
  const ico = Buffer.from([0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x10, 0x10])
  assert.equal(detectMime(ico), 'image/x-icon')
  assert.equal(validateUpload({ tipo: 'favicon', nombre: 'favicon.ico', contenido: b64(ico) }).mime, 'image/x-icon')
  assert.equal(validateUpload({ tipo: 'favicon', nombre: 'f.png', contenido: b64(png) }).mime, 'image/png')
  assert.ok(validateUpload({ tipo: 'favicon', nombre: 'f.pdf', contenido: b64(pdf) }).error)
  assert.ok(validateUpload({ tipo: 'favicon', nombre: 'f.png', contenido: b64(Buffer.concat([png, Buffer.alloc(1024 * 1024)])) }).error)
  assert.ok(validateUpload({ tipo: 'imagen', nombre: 'f.ico', contenido: b64(ico) }).error)
})

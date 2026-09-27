import test from 'node:test'
import assert from 'node:assert/strict'
import { validateContact, validateLogin } from '../src/utils/validators.js'

test('valida un mensaje correcto', () => {
  const result = validateContact({ nombre: 'Ana', email: 'ana@test.com', asunto: 'Consulta', mensaje: 'Este mensaje es válido.' })
  assert.deepEqual(result.errors, {})
})

test('rechaza un mensaje incompleto', () => {
  const result = validateContact({ nombre: 'A', email: 'mal', asunto: '', mensaje: 'corto' })
  assert.equal(Object.keys(result.errors).length, 4)
})

test('el login requiere email y contraseña segura', () => {
  assert.equal(validateLogin({ email: 'admin@test.com', password: 'Cambiar123!' }).valid, true)
  assert.equal(validateLogin({ email: 'mal', password: '123' }).valid, false)
})

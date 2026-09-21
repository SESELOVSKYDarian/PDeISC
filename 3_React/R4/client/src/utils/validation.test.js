import { describe, expect, it } from 'vitest'
import { validateContact } from './validation.js'

describe('validateContact', () => {
  it('acepta datos válidos', () => expect(validateContact({ nombre: 'Ana', email: 'ana@test.com', asunto: 'Consulta', mensaje: 'Un mensaje suficientemente largo.' })).toEqual({}))
  it('marca los cuatro campos inválidos', () => expect(Object.keys(validateContact({ nombre: '', email: 'mal', asunto: '', mensaje: '' }))).toHaveLength(4))
})

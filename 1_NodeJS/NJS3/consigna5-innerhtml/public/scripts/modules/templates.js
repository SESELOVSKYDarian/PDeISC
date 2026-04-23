// estos son los bloques que voy metiendo con innerHTML
export const templates = {
  title: `
    <section class="render-block">
      <h2>Titulo agregado con innerHTML</h2>
    </section>
  `,
  paragraph: `
    <section class="render-block">
      <p>Este parrafo fue agregado dinamicamente usando innerHTML.</p>
    </section>
  `,
  list: `
    <section class="render-block">
      <ul>
        <li>HTML</li>
        <li>CSS</li>
        <li>JavaScript</li>
      </ul>
    </section>
  `,
  card: `
    <section class="render-block">
      <article class="mini-card">
        <h3>Tarjeta dinamica</h3>
        <p>Contenido generado por el evento click.</p>
      </article>
    </section>
  `
};

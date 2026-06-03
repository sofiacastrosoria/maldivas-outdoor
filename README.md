# Maldivas Outdoor

Plataforma web premium para **Maldivas Outdoor** — muebles de exterior de lujo silencioso. Inspiración visual: Apple, RH Outdoor, Tribù, hoteles boutique.

## Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**

## Inicio rápido

```bash
cd maldivas-outdoor
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## Estructura

| Ruta | Descripción |
|------|-------------|
| `/` | About Us (home) — hero cinematográfico, storytelling |
| `/productos` | 3 categorías: Reposeras, Living, Comedor |
| `/productos/reposeras/[slug]` | Detalle + configurador |
| `/productos/living/[slug]` | Sillones |
| `/productos/living/mesas/[slug]` | Mesas con piedra |
| `/productos/comedor/[slug]` | Marbella |
| `/materiales` | Aluminio, telas, goma, piedras |
| `/contacto` | Datos, mapa, formulario |
| `/faq` | Accordion preparado |

## Funcionalidades

- Navbar estilo Apple con menú lateral blur
- Carrito drawer dinámico (localStorage)
- Configurador premium con precio en tiempo real
- Precio base USD $123 + modificadores por tamaño, estructura, tela y piedra

## Personalización de precios

Editar `src/lib/pricing.ts` y `src/data/products.ts` para ajustar precios base y modificadores.

## Build producción

```bash
npm run build
npm start
```

## Próximos pasos sugeridos

- Reemplazar imágenes Unsplash por fotografía real de producto
- Conectar formulario de contacto a backend/email
- Integrar pasarela de pago o CRM para cotizaciones
- Panel admin para precios editables

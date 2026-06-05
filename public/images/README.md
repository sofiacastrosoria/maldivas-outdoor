# Imágenes Maldivas Outdoor

Dos sistemas separados — **no mezclar**.

---

## 1. Personalizador (configurador)

Archivos **planos** dentro de la carpeta de categoría.

### Carpetas
```
public/images/reposeras/
public/images/living/
public/images/comedor/
```

### Formato de nombre (obligatorio)

```
{tipo}-{modelo}-{tamaño}-{estructura}-{tapizado}.jpg
```

### Tipos
| Categoría  | Prefijo    |
|------------|------------|
| Reposeras  | `reposera` |
| Sillones   | `living`   |
| Mesas      | `mesa`     |
| Comedor    | `comedor`  |

### Tamaños
| Configurador | Archivo   |
|--------------|-----------|
| Estándar     | `simple`  |
| Doble        | `doble`   |
| 1 cuerpo     | `1cuerpo` |
| 4 cuerpos    | `4cuerpos`|

### Estructuras (sin guiones)
| Configurador           | Archivo              |
|------------------------|----------------------|
| Símil madera blanco    | `similmaderablanco`  |
| Símil madera marrón    | `similmaderamarron`  |
| Anodizado negro        | `anodizadonegro`     |
| Anodizado peltre       | `anodizadopeltre`    |
| Greige pintado         | `greige`             |
| Negro pintado          | `negropintado`       |
| Blanco pintado         | `blancopintado`      |
| Anodizado natural      | `anodizadonatural`   |

### Tapizados
`negro` · `gris` · `beige` · `blanco`

### Ejemplos
```
reposera-fendi-simple-similmaderamarron-negro.jpg
reposera-fendi-doble-similmaderablanco-blanco.jpg
living-fendi-1cuerpo-similmaderamarron-negro.jpg
living-malaga-4cuerpos-negropintado-blanco.jpg
```

### Mesas living y Comedor (3 fotos fijas, **manual**, sin autoplay)

**Carpeta:**

```
public/images/mesas/{modelo}/
```

**Archivos:**

```
1.jpg
2.jpg
3.jpg
```

---

## 2. Sliders editoriales (portadas)

Solo para **portadas automáticas** — NO afectan el personalizador.

### Carpetas
```
public/images/sliders/reposeras/
public/images/sliders/living/
public/images/sliders/comedor/
```

Arrastrá tus JPG con nombres libres (ej. `01-reposera-fendi-terraza.jpg`).

Registrá cada archivo en:
`src/data/editorialSliders.ts`

---

## 3. Sliders por modelo (Nivel “Modelos”)

Para que cada card de modelo tenga autoplay de variantes (solo preview, no personalizador):

### Carpetas

```
public/images/model-sliders/reposeras/{modelo}/
public/images/model-sliders/living/{modelo}/
public/images/model-sliders/comedor/{modelo}/
```

### Archivos

```
1.jpg
2.jpg
3.jpg
...
```

El sistema carga `1.jpg` → `2.jpg` → `3.jpg` y frena cuando falta la siguiente.

---

## Si falta imagen

Placeholder: *"No hay imagen disponible para esta configuración"*

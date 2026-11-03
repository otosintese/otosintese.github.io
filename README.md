# otoworks.org

Site da comunidade **otoworks** — ferramentas abertas para automatizar, facilitar e otimizar trabalhos.

## Estrutura

```
.
├── index.html          # página inicial
├── projetos.html       # página de projetos
├── projetos.json       # ← cadastro dos projetos
├── css/
│   ├── style.css       # design system + página inicial
│   └── projects.css    # estilos da página de projetos
├── js/
│   ├── cards.js        # renderização dos cartões
│   ├── main.js         # menu, animações, destaques
│   └── projects.js     # busca, filtros e listagem
└── assets/             # imagens e favicon
```

## Adicionar ou editar um projeto

Tudo é controlado pelo arquivo **`projetos.json`**. Adicione um objeto ao array `projects`:

```json
{
  "title": "Meu projeto",
  "description": "Uma frase curta explicando o que ele faz.",
  "url": "https://exemplo.com",
  "tags": ["python", "automação"],
  "status": "ativo",
  "featured": true,
  "accent": "purple",
  "icon": "🚀"
}
```

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `title` | sim | Nome exibido no cartão. |
| `description` | sim | Texto curto sobre o projeto. |
| `url` | sim | Link externo aberto em uma nova aba. |
| `tags` | não | Lista de tags usadas na busca e nos filtros. |
| `status` | não | `ativo`, `em breve` ou `arquivado` (padrão: `ativo`). |
| `featured` | não | `true` para também aparecer nos destaques da página inicial. |
| `accent` | não | `green` ou `purple` (cor de destaque do cartão). |
| `icon` | não | Emoji ou caminho de imagem (ex.: `assets/icone.png`). Sem ícone, usa a inicial do título. |

Depois de editar, salve o arquivo e recarregue a página. Nenhum build é necessário.

## Rodar localmente

O site é estático, mas a página de projetos usa `fetch()` para ler o JSON — por isso é necessário um servidor local (abrir o arquivo direto com `file://` bloqueia a leitura):

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Publicação

O deploy é feito via GitHub Pages. O domínio personalizado fica em `CNAME` (`otoworks.org`).

## Paleta

| Cor | Uso |
| --- | --- |
| `#05070b` | fundo |
| `#3fb950` / `#7ee787` | verde — ações e status |
| `#a371f7` / `#c9a7ff` | roxo — destaques e detalhes |
| `#e8edf4` | texto |
| `#8b96a5` | texto secundário |

Tipografia: **Space Grotesk** (títulos), **Inter** (texto) e **JetBrains Mono** (código).

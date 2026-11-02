/* ==========================================================================
   otoworks.org — comportamento e conteúdo dinâmico
   --------------------------------------------------------------------------
   EDITE AQUI:
   1. SERVER_INVITES  -> links de convite do Fluxer e do Discord
   2. PORTAL_LINKS    -> cartões da página Portal
   3. PROJETOS        -> cartões da página Projetos OTO
   ========================================================================== */

"use strict";

/* --------------------------------------------------------------------------
   1. LINKS DOS SERVIDORES
   Substitua os "#" pelos links de convite reais. Os dois abrem em nova aba.
   -------------------------------------------------------------------------- */
const SERVER_INVITES = {
  fluxer: "#", // TODO: link de convite do Fluxer
  discord: "#", // TODO: link de convite do Discord
};

/* --------------------------------------------------------------------------
   2. PORTAL — mínimo de 8 cartões
   Cada item: { nome, descricao, url }. Se faltar algum cartão ou campo,
   a página completa a grade com um cartão de link "#" para ser preenchido.
   -------------------------------------------------------------------------- */
const PORTAL_LINKS = [
  {
    nome: "Projetos OTO",
    descricao: "Projetos oficiais da comunidade.",
    url: "projetos.html",
  },
  {
    nome: "Equipe OTO",
    descricao: "Informações para participar da equipe.",
    url: "equipe.html",
  },
  {
    nome: "Servidor Fluxer",
    descricao: "A comunidade no Fluxer.",
    url: "#", // TODO: link do servidor no Fluxer
  },
  {
    nome: "Servidor Discord",
    descricao: "A comunidade no Discord.",
    url: "#", // TODO: link do servidor no Discord
  },
  {
    nome: "GitHub",
    descricao: "Código e repositórios da otoworks.",
    url: "#", // TODO: link do GitHub
  },
  {
    nome: "Documentação",
    descricao: "Guias e referências dos projetos.",
    url: "#", // TODO: link da documentação
  },
  {
    nome: "Status",
    descricao: "Disponibilidade dos serviços.",
    url: "#", // TODO: link da página de status
  },
  {
    nome: "Contato",
    descricao: "Fale com a comunidade.",
    url: "#", // TODO: link de contato
  },
];

/* --------------------------------------------------------------------------
   3. PROJETOS OTO — 4 a 6 cartões
   Substitua nome, descricao, url e o status opcional pelos projetos reais.
   -------------------------------------------------------------------------- */
const PROJETOS = [
  {
    nome: "Projeto 01",
    descricao: "Espaço reservado para o primeiro projeto oficial da comunidade.",
    url: "#", // TODO: link do projeto
    status: "Em breve",
  },
  {
    nome: "Projeto 02",
    descricao: "Espaço reservado para o segundo projeto oficial da comunidade.",
    url: "#", // TODO: link do projeto
    status: "Em desenvolvimento",
  },
  {
    nome: "Projeto 03",
    descricao: "Espaço reservado para o terceiro projeto oficial da comunidade.",
    url: "#", // TODO: link do projeto
    status: "Planejado",
  },
  {
    nome: "Projeto 04",
    descricao: "Espaço reservado para o quarto projeto oficial da comunidade.",
    url: "#", // TODO: link do projeto
    status: "Planejado",
  },
  {
    nome: "Projeto 05",
    descricao: "Espaço reservado para o quinto projeto oficial da comunidade.",
    url: "#", // TODO: link do projeto
    status: "Em breve",
  },
];

/* ==========================================================================
   A partir daqui não é necessário editar para publicar o site.
   ========================================================================== */

const PORTAL_MINIMO = 8;

function texto(valor) {
  return typeof valor === "string" ? valor.trim() : "";
}

function criarArrow(classe, tipo) {
  const seta = document.createElement("span");
  seta.className = classe;
  seta.setAttribute("aria-hidden", "true");

  const caminho =
    tipo === "externo"
      ? '<path d="M5 11 11 5M6 5h5v5"/>'
      : '<path d="M3.5 8h9M8.5 4l4 4-4 4"/>';

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = caminho;
  seta.append(svg);

  return seta;
}

function adicionarAvisoNovaAba(titulo) {
  const aviso = document.createElement("span");
  aviso.className = "sr-only";
  aviso.textContent = " (abre em nova aba)";
  titulo.append(aviso);
}

function numeroIndice(indice) {
  return String(indice + 1).padStart(2, "0");
}

/* --------------------------------------------------------------------------
   Portal
   -------------------------------------------------------------------------- */
function renderPortal() {
  const grade = document.querySelector("#portal-grid");
  if (!grade) return;

  const origem = Array.isArray(PORTAL_LINKS) ? PORTAL_LINKS : [];
  const itens = origem
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      nome: texto(item.nome),
      descricao: texto(item.descricao),
      url: texto(item.url),
    }));

  const incompleto =
    itens.length < PORTAL_MINIMO ||
    itens.some((item) => !item.nome || !item.descricao || !item.url);

  /* Completa a grade para garantir os 8 cartões configuráveis. */
  while (itens.length < PORTAL_MINIMO) {
    itens.push({
      nome: "Adicionar link",
      descricao: "Preencha este cartão no array PORTAL_LINKS em assets/app.js.",
      url: "#",
    });
  }

  if (incompleto) {
    grade.append(
      document.createComment(
        " PORTAL INCOMPLETO: preencha nome, descricao e url de cada item no array PORTAL_LINKS em assets/app.js. "
      )
    );
  }

  const fragmento = document.createDocumentFragment();

  itens.forEach((item, indice) => {
    const cartao = document.createElement("a");
    cartao.className = "link-card";
    cartao.href = item.url || "#";
    cartao.target = "_blank";
    cartao.rel = "noopener";

    const topo = document.createElement("span");
    topo.className = "link-card__top";

    const numero = document.createElement("span");
    numero.className = "link-card__index";
    numero.setAttribute("aria-hidden", "true");
    numero.textContent = numeroIndice(indice);

    topo.append(numero, criarArrow("link-card__arrow", "externo"));

    const titulo = document.createElement("h2");
    titulo.textContent = item.nome || "Adicionar link";
    adicionarAvisoNovaAba(titulo);

    const descricao = document.createElement("p");
    descricao.textContent =
      item.descricao || "Preencha este cartão no array PORTAL_LINKS em assets/app.js.";

    cartao.append(topo, titulo, descricao);
    fragmento.append(cartao);
  });

  grade.replaceChildren(fragmento);
}

/* --------------------------------------------------------------------------
   Projetos OTO
   -------------------------------------------------------------------------- */
function renderProjetos() {
  const lista = document.querySelector("#projetos-list");
  if (!lista) return;

  const origem = Array.isArray(PROJETOS) ? PROJETOS : [];
  const itens = origem
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      nome: texto(item.nome),
      descricao: texto(item.descricao),
      url: texto(item.url),
      status: texto(item.status),
    }));

  const incompleto =
    itens.length === 0 ||
    itens.some((item) => !item.nome || !item.descricao || !item.url);

  /* Se a lista estiver vazia, mantém a página apresentável com 4 cartões. */
  while (itens.length > 0 && itens.length < 4) {
    itens.push({
      nome: "Adicionar projeto",
      descricao: "Preencha este cartão no array PROJETOS em assets/app.js.",
      url: "#",
      status: "",
    });
  }

  if (itens.length === 0) {
    for (let i = 0; i < 4; i += 1) {
      itens.push({
        nome: "Adicionar projeto",
        descricao: "Preencha este cartão no array PROJETOS em assets/app.js.",
        url: "#",
        status: "",
      });
    }
  }

  if (incompleto) {
    lista.append(
      document.createComment(
        " PROJETOS INCOMPLETOS: preencha nome, descricao e url de cada item no array PROJETOS em assets/app.js. "
      )
    );
  }

  const fragmento = document.createDocumentFragment();

  itens.forEach((item, indice) => {
    const cartao = document.createElement("a");
    cartao.className = "project-card";
    cartao.href = item.url || "#";
    cartao.target = "_blank";
    cartao.rel = "noopener";

    const numero = document.createElement("span");
    numero.className = "project-card__index";
    numero.setAttribute("aria-hidden", "true");
    numero.textContent = numeroIndice(indice);

    const corpo = document.createElement("div");
    corpo.className = "project-card__body";

    const titulo = document.createElement("h2");
    titulo.textContent = item.nome || "Adicionar projeto";
    adicionarAvisoNovaAba(titulo);

    const descricao = document.createElement("p");
    descricao.textContent =
      item.descricao || "Preencha este cartão no array PROJETOS em assets/app.js.";

    corpo.append(titulo, descricao);

    const meta = document.createElement("div");
    meta.className = "project-card__meta";

    if (item.status) {
      const status = document.createElement("span");
      status.className = "project-card__status";
      status.textContent = item.status;
      meta.append(status);
    }

    meta.append(criarArrow("project-card__arrow", "externo"));

    cartao.append(numero, corpo, meta);
    fragmento.append(cartao);
  });

  lista.replaceChildren(fragmento);
}

/* --------------------------------------------------------------------------
   Header: sombra ao rolar e menu em telas pequenas
   -------------------------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#site-nav");

  if (header) {
    const atualizarHeader = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    atualizarHeader();
    window.addEventListener("scroll", atualizarHeader, { passive: true });
  }

  if (!toggle || !nav) return;

  const menuAberto = () => toggle.getAttribute("aria-expanded") === "true";
  const desktop = window.matchMedia("(min-width: 761px)");

  const fecharMenu = (devolverFoco = false) => {
    if (!menuAberto()) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
    nav.classList.remove("is-open");
    if (devolverFoco) toggle.focus();
  };

  toggle.addEventListener("click", () => {
    const abrir = !menuAberto();
    toggle.setAttribute("aria-expanded", String(abrir));
    toggle.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
    nav.classList.toggle("is-open", abrir);

    if (abrir) {
      const primeiroLink = nav.querySelector("a");
      if (primeiroLink) primeiroLink.focus();
    }
  });

  nav.addEventListener("click", (evento) => {
    if (evento.target.closest("a")) fecharMenu();
  });

  document.addEventListener("click", (evento) => {
    if (!menuAberto()) return;
    if (nav.contains(evento.target) || toggle.contains(evento.target)) return;
    fecharMenu();
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && menuAberto()) {
      evento.preventDefault();
      fecharMenu(true);
    }
  });

  const aoMudarTela = (evento) => {
    if (evento.matches) fecharMenu();
  };

  if (typeof desktop.addEventListener === "function") {
    desktop.addEventListener("change", aoMudarTela);
  } else {
    desktop.addListener(aoMudarTela);
  }
}

/* --------------------------------------------------------------------------
   Modal do servidor: foco preso, Esc, clique fora e restauração de foco
   -------------------------------------------------------------------------- */
function initModalServidor() {
  const modal = document.querySelector("#server-modal");
  const abrirBtn = document.querySelector("[data-open-server]");

  if (!modal || !abrirBtn) return;

  const painel = modal.querySelector(".modal__panel");
  const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");
  const focoSeletor =
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  let ultimoFoco = null;
  let timerOcultar = null;

  const focaveis = () =>
    Array.from(modal.querySelectorAll(focoSeletor)).filter(
      (elemento) =>
        !elemento.hasAttribute("hidden") &&
        elemento.getAttribute("aria-hidden") !== "true" &&
        elemento.offsetParent !== null
    );

  const aoTeclar = (evento) => {
    if (evento.key === "Escape") {
      evento.preventDefault();
      fecharModal();
      return;
    }

    if (evento.key !== "Tab") return;

    const elementos = focaveis();
    if (elementos.length === 0) {
      evento.preventDefault();
      painel.focus();
      return;
    }

    const primeiro = elementos[0];
    const ultimo = elementos[elementos.length - 1];
    const ativo = document.activeElement;

    if (evento.shiftKey) {
      if (ativo === primeiro || ativo === painel) {
        evento.preventDefault();
        ultimo.focus();
      }
    } else if (ativo === ultimo) {
      evento.preventDefault();
      primeiro.focus();
    }
  };

  const fecharModal = () => {
    modal.classList.remove("is-open");
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", aoTeclar);

    const espera = reduzirMovimento.matches ? 0 : 240;
    window.clearTimeout(timerOcultar);
    timerOcultar = window.setTimeout(() => {
      modal.hidden = true;
    }, espera);

    if (ultimoFoco && typeof ultimoFoco.focus === "function") {
      ultimoFoco.focus({ preventScroll: true });
    }
  };

  const abrirModal = () => {
    window.clearTimeout(timerOcultar);
    ultimoFoco = document.activeElement;

    modal.hidden = false;
    /* Força o navegador a registrar o estado inicial antes da transição. */
    void modal.offsetWidth;

    modal.classList.add("is-open");
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", aoTeclar);
    painel.focus({ preventScroll: true });
  };

  abrirBtn.addEventListener("click", abrirModal);

  modal.addEventListener("click", (evento) => {
    if (evento.target.closest("[data-close-modal]")) fecharModal();
  });

  /* Liga os links configurados no topo do arquivo. */
  Object.entries(SERVER_INVITES).forEach(([plataforma, url]) => {
    const link = modal.querySelector('[data-server-link="' + plataforma + '"]');
    if (link) link.href = url || "#";
  });
}

/* --------------------------------------------------------------------------
   Inicialização
   -------------------------------------------------------------------------- */
function iniciar() {
  initHeader();
  initModalServidor();
  renderPortal();
  renderProjetos();
}

iniciar();

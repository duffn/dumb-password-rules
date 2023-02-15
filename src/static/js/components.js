function useTrackedPointer() {
  let e = [-1, -1];
  return {
    wasMoved(t) {
      let n = [t.screenX, t.screenY];
      return (e[0] !== n[0] || e[1] !== n[1]) && ((e = n), !0);
    },
    update(t) {
      e = [t.screenX, t.screenY];
    },
  };
}
(window.Components = {}),
  (window.Components.listbox = function (e) {
    let t = e.modelName || "selected",
      n = useTrackedPointer();
    return {
      init() {
        (this.optionCount = this.$refs.listbox.children.length),
          this.$watch("activeIndex", (e) => {
            this.open &&
              (null !== this.activeIndex
                ? (this.activeDescendant =
                    this.$refs.listbox.children[this.activeIndex].id)
                : (this.activeDescendant = ""));
          });
      },
      activeDescendant: null,
      optionCount: null,
      open: !1,
      activeIndex: null,
      selectedIndex: 0,
      get active() {
        return this.items[this.activeIndex];
      },
      get [t]() {
        return this.items[this.selectedIndex];
      },
      choose(e) {
        (this.selectedIndex = e), (this.open = !1);
      },
      onButtonClick() {
        this.open ||
          ((this.activeIndex = this.selectedIndex),
          (this.open = !0),
          this.$nextTick(() => {
            this.$refs.listbox.focus(),
              this.$refs.listbox.children[this.activeIndex].scrollIntoView({
                block: "nearest",
              });
          }));
      },
      onOptionSelect() {
        null !== this.activeIndex && (this.selectedIndex = this.activeIndex),
          (this.open = !1),
          this.$refs.button.focus();
      },
      onEscape() {
        (this.open = !1), this.$refs.button.focus();
      },
      onArrowUp() {
        (this.activeIndex =
          this.activeIndex - 1 < 0
            ? this.optionCount - 1
            : this.activeIndex - 1),
          this.$refs.listbox.children[this.activeIndex].scrollIntoView({
            block: "nearest",
          });
      },
      onArrowDown() {
        (this.activeIndex =
          this.activeIndex + 1 > this.optionCount - 1
            ? 0
            : this.activeIndex + 1),
          this.$refs.listbox.children[this.activeIndex].scrollIntoView({
            block: "nearest",
          });
      },
      onMouseEnter(e) {
        n.update(e);
      },
      onMouseMove(e, t) {
        n.wasMoved(e) && (this.activeIndex = t);
      },
      onMouseLeave(e) {
        n.wasMoved(e) && (this.activeIndex = null);
      },
      ...e,
    };
  }),
  (window.Components.menu = function (e = { open: !1 }) {
    let t = useTrackedPointer();
    return {
      init() {
        (this.items = Array.from(
          this.$el.querySelectorAll('[role="menuitem"]')
        )),
          this.$watch("open", () => {
            this.open && (this.activeIndex = -1);
          });
      },
      activeDescendant: null,
      activeIndex: null,
      items: null,
      open: e.open,
      focusButton() {
        this.$refs.button.focus();
      },
      onButtonClick() {
        (this.open = !this.open),
          this.open &&
            this.$nextTick(() => {
              this.$refs["menu-items"].focus();
            });
      },
      onButtonEnter() {
        (this.open = !this.open),
          this.open &&
            ((this.activeIndex = 0),
            (this.activeDescendant = this.items[this.activeIndex].id),
            this.$nextTick(() => {
              this.$refs["menu-items"].focus();
            }));
      },
      onArrowUp() {
        if (!this.open)
          return (
            (this.open = !0),
            (this.activeIndex = this.items.length - 1),
            void (this.activeDescendant = this.items[this.activeIndex].id)
          );
        0 !== this.activeIndex &&
          ((this.activeIndex =
            -1 === this.activeIndex
              ? this.items.length - 1
              : this.activeIndex - 1),
          (this.activeDescendant = this.items[this.activeIndex].id));
      },
      onArrowDown() {
        if (!this.open)
          return (
            (this.open = !0),
            (this.activeIndex = 0),
            void (this.activeDescendant = this.items[this.activeIndex].id)
          );
        this.activeIndex !== this.items.length - 1 &&
          ((this.activeIndex = this.activeIndex + 1),
          (this.activeDescendant = this.items[this.activeIndex].id));
      },
      onClickAway(e) {
        if (this.open) {
          const t = [
            "[contentEditable=true]",
            "[tabindex]",
            "a[href]",
            "area[href]",
            "button:not([disabled])",
            "iframe",
            "input:not([disabled])",
            "select:not([disabled])",
            "textarea:not([disabled])",
          ]
            .map((e) => `${e}:not([tabindex='-1'])`)
            .join(",");
          (this.open = !1), e.target.closest(t) || this.focusButton();
        }
      },
      onMouseEnter(e) {
        t.update(e);
      },
      onMouseMove(e, n) {
        t.wasMoved(e) && (this.activeIndex = n);
      },
      onMouseLeave(e) {
        t.wasMoved(e) && (this.activeIndex = -1);
      },
    };
  }),
  (window.Components.popoverGroup = function () {
    return {
      __type: "popoverGroup",
      init() {
        let e = (t) => {
          document.body.contains(this.$el)
            ? t.target instanceof Element &&
              !this.$el.contains(t.target) &&
              window.dispatchEvent(
                new CustomEvent("close-popover-group", { detail: this.$el })
              )
            : window.removeEventListener("focus", e, !0);
        };
        window.addEventListener("focus", e, !0);
      },
    };
  }),
  (window.Components.popover = function ({ open: e = !1, focus: t = !1 } = {}) {
    const n = [
      "[contentEditable=true]",
      "[tabindex]",
      "a[href]",
      "area[href]",
      "button:not([disabled])",
      "iframe",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
    ]
      .map((e) => `${e}:not([tabindex='-1'])`)
      .join(",");
    return {
      __type: "popover",
      open: e,
      init() {
        t &&
          this.$watch("open", (e) => {
            e &&
              this.$nextTick(() => {
                !(function (e) {
                  const t = Array.from(e.querySelectorAll(n));
                  !(function e(n) {
                    void 0 !== n &&
                      (n.focus({ preventScroll: !0 }),
                      document.activeElement !== n && e(t[t.indexOf(n) + 1]));
                  })(t[0]);
                })(this.$refs.panel);
              });
          });
        let e = (n) => {
          if (!document.body.contains(this.$el))
            return void window.removeEventListener("focus", e, !0);
          let i = t ? this.$refs.panel : this.$el;
          if (
            this.open &&
            n.target instanceof Element &&
            !i.contains(n.target)
          ) {
            let e = this.$el;
            for (; e.parentNode; )
              if (((e = e.parentNode), e.__x instanceof this.constructor)) {
                if ("popoverGroup" === e.__x.$data.__type) return;
                if ("popover" === e.__x.$data.__type) break;
              }
            this.open = !1;
          }
        };
        window.addEventListener("focus", e, !0);
      },
      onEscape() {
        (this.open = !1), this.restoreEl && this.restoreEl.focus();
      },
      onClosePopoverGroup(e) {
        e.detail.contains(this.$el) && (this.open = !1);
      },
      toggle(e) {
        (this.open = !this.open),
          this.open
            ? (this.restoreEl = e.currentTarget)
            : this.restoreEl && this.restoreEl.focus();
      },
    };
  }),
  (window.Components.radioGroup = function ({
    initialCheckedIndex: e = 0,
  } = {}) {
    return {
      value: void 0,
      active: void 0,
      init() {
        let t = Array.from(this.$el.querySelectorAll("input"));
        this.value = t[e]?.value;
        for (let e of t)
          e.addEventListener("change", () => {
            this.active = e.value;
          }),
            e.addEventListener("focus", () => {
              this.active = e.value;
            });
        window.addEventListener(
          "focus",
          () => {
            console.log("Focus change"),
              t.includes(document.activeElement) ||
                (console.log("HIT"), (this.active = void 0));
          },
          !0
        );
      },
    };
  }),
  (window.Components.tabs = function () {
    return {
      selectedIndex: 0,
      onTabClick(e) {
        if (!this.$el.contains(e.detail)) return;
        let t = Array.from(
            this.$el.querySelectorAll('[x-data^="Components.tab("]')
          ),
          n = Array.from(
            this.$el.querySelectorAll('[x-data^="Components.tabPanel("]')
          ),
          i = t.indexOf(e.detail);
        (this.selectedIndex = i),
          window.dispatchEvent(
            new CustomEvent("tab-select", {
              detail: { tab: e.detail, panel: n[i] },
            })
          );
      },
      onTabKeydown(e) {
        if (!this.$el.contains(e.detail.tab)) return;
        let t = Array.from(
            this.$el.querySelectorAll('[x-data^="Components.tab("]')
          ),
          n = t.indexOf(e.detail.tab);
        "ArrowLeft" === e.detail.key
          ? this.onTabClick({ detail: t[(n - 1 + t.length) % t.length] })
          : "ArrowRight" === e.detail.key
          ? this.onTabClick({ detail: t[(n + 1) % t.length] })
          : "Home" === e.detail.key || "PageUp" === e.detail.key
          ? this.onTabClick({ detail: t[0] })
          : ("End" !== e.detail.key && "PageDown" !== e.detail.key) ||
            this.onTabClick({ detail: t[t.length - 1] });
      },
    };
  }),
  (window.Components.tab = function (e = 0) {
    return {
      selected: !1,
      init() {
        let t = Array.from(
          this.$el
            .closest('[x-data^="Components.tabs("]')
            .querySelectorAll('[x-data^="Components.tab("]')
        );
        (this.selected = t.indexOf(this.$el) === e),
          this.$watch("selected", (e) => {
            e && this.$el.focus();
          });
      },
      onClick() {
        window.dispatchEvent(
          new CustomEvent("tab-click", { detail: this.$el })
        );
      },
      onKeydown(e) {
        [
          "ArrowLeft",
          "ArrowRight",
          "Home",
          "PageUp",
          "End",
          "PageDown",
        ].includes(e.key) && e.preventDefault(),
          window.dispatchEvent(
            new CustomEvent("tab-keydown", {
              detail: { tab: this.$el, key: e.key },
            })
          );
      },
      onTabSelect(e) {
        this.selected = e.detail.tab === this.$el;
      },
    };
  }),
  (window.Components.tabPanel = function (e = 0) {
    return {
      selected: !1,
      init() {
        let t = Array.from(
          this.$el
            .closest('[x-data^="Components.tabs("]')
            .querySelectorAll('[x-data^="Components.tabPanel("]')
        );
        this.selected = t.indexOf(this.$el) === e;
      },
      onTabSelect(e) {
        this.selected = e.detail.panel === this.$el;
      },
    };
  });

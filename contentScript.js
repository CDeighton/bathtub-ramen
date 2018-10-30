class EmojiSwapper {
  constructor(unicode, custom, partying) {
    this.unicode = unicode;
    this.custom = custom || {};
    this.partying = partying;

    this.watchDOM();
  }

  swap(tag) {
    new Set(tag.innerText.match(EmojiSwapper.MATCHER)).forEach((match) => {
      const name = match.slice(1,-1);
      const emoji = this.unicode[name];

      if (emoji) {
        tag.innerHTML = tag.innerHTML.replace(match, EmojiSwapper.PRESENT_UNICODE(name, emoji));
        return;
      }

      const src = this.custom[name];

      if (src) tag.innerHTML = tag.innerHTML.replace(match, EmojiSwapper.BUILD_IMAGE(name, src));
    });
  }

  partyWithCorrectFirmness() {
    const container = document.getElementsByClassName("uiScrollableAreaContent")[2];

    chrome.storage.local.get("partying", function(storage) {
      if (storage["partying"] && container) {
        container.classList.add("party-mode");
      }
      else if (container) {
        container.classList.remove("party-mode");
      }
    });
  }

  watchDOM() {
    setInterval(() => { this.partyWithCorrectFirmness(); }, 100);

    const observer = new MutationObserver((mutations) => {
      this.partyWithCorrectFirmness();

      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          Array.from(document.getElementsByTagName("span"))
            .filter((tag) => !tag.isContentEditable && tag.children.length === 0 && tag.innerText.match(EmojiSwapper.MATCHER))
            .forEach((tag) => this.swap(tag));
        }
      });
    });

    observer.observe(document.body, {
    	childList: true,
    	attributes: false,
    	characterData: true,
    	subtree: true
    });
  }

  static PRESENT_UNICODE(name, emoji) {
    return `<b title="${name}">${emoji}</b>`
  }

  static BUILD_IMAGE(name, src) {
    const image = new Image();
    image.height = EmojiSwapper.SIZE;
    image.title = name;
    image.src = src;

    return image.outerHTML;
  }

  static get MATCHER() { return /:\w*:/g; }
  static get SIZE() { return 20; }
}

chrome.storage.local.get(["unicode_emoji", "custom_emoji", "partying"], (data) => { new EmojiSwapper(data.unicode_emoji, data.custom_emoji, data.partying) });

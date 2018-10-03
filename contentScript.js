class EmojiSwapper {
  constructor(emoji) {
    this.emoji = emoji;

    this.watchDOM();
  }

  swap(tag) {
    new Set(tag.innerText.match(EmojiSwapper.MATCHER)).forEach((match) => {
      const name = match.slice(1,-1);
      const src = this.emoji[name];

      if (src) tag.innerHTML = tag.innerHTML.replace(match, EmojiSwapper.BUILD_IMAGE(name, src));
    });
  }

  watchDOM() {
    const observer = new MutationObserver((mutations) => {
      Array.from(document.getElementsByTagName("span"))
        .filter((tag) => !tag.isContentEditable && tag.children.length === 0 && tag.innerText.match(EmojiSwapper.MATCHER))
        .forEach((tag) => this.swap(tag));
    });

    observer.observe(document.body, {
    	childList: true,
    	attributes: false,
    	characterData: true,
    	subtree: true
    });
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

chrome.storage.sync.get("emoji", (data) => { new EmojiSwapper(data.emoji) });

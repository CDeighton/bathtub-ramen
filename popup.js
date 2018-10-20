const tokenField = document.querySelector("#token");
const form = document.querySelector("#form");
const refresh = document.querySelector("#refresh");
const party = document.querySelector("#party");
const messages = document.querySelector("#messages");

const URL = "https://slack.com/api/emoji.list";

function refreshEmoji() {
  chrome.storage.local.get("token", (data) => {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", `${URL}?token=${data.token}`, true);
    xhr.withCredentials = true;
    xhr.responseType = "json";

    xhr.onload = () => {
      if (xhr.status === 200) {
        chrome.storage.local.set({ custom_emoji: xhr.response.emoji });
      }
    };

    xhr.send();
  });
}

function togglePartying() {
  chrome.storage.local.set({"partying" : party.checked});
};

refresh.onclick = () => {
  refreshEmoji();
  messages.innerText = "Refreshed";
};

party.onclick = () => {
  togglePartying();

  chrome.storage.local.get("partying", function(storage) {
    if (storage["partying"]) {
      messages.innerText = "Partying hard";
    } else {
      messages.innerText = "Partying slightly less hard";
    }
  });
};

form.onsubmit = (event) => {
  event.preventDefault();
  const token = tokenField.value;

  chrome.storage.local.set({ token: token });
  refreshEmoji();

  messages.innerText = "Saved";
}

chrome.storage.local.get("token", (data) => { tokenField.value = data.token });
chrome.storage.local.get("partying", (data) => { party.checked = data.partying });

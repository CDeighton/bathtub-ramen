const tokenField = document.querySelector("#token");
const form = document.querySelector("#form");

const URL = "https://slack.com/api/emoji.list";

form.onsubmit = (event) => {
  event.preventDefault();
  const token = tokenField.value;

  chrome.storage.sync.set({ token: token });

  const xhr = new XMLHttpRequest();

  xhr.open("GET", `${URL}?token=${token}`, true);
  xhr.withCredentials = true;
  xhr.responseType = "json";

  xhr.onload = () => {
    if (xhr.status === 200) {
      chrome.storage.sync.set({ emoji: xhr.response.emoji });
    }
  };

  xhr.send();
}

chrome.storage.sync.get("token", (data) => { tokenField.value = data.token });

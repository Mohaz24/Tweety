import { tweetsData as data } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

/* Localstorage */
let tweetsData = data;

if (localStorage.getItem("key")) {
  tweetsData = JSON.parse(localStorage.getItem("key"));
}

/* All the Event Listeners */
document.addEventListener("click", function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  } else if (e.target.dataset.replyBtns) {
    replyBackToUsersBtn(e.target.dataset.replyBtns);
  } else if (e.target.dataset.remove) {
    removeTweets(e.target.dataset.remove);
  }
});

function handleLikeClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--;
  } else {
    targetTweetObj.likes++;
  }
  targetTweetObj.isLiked = !targetTweetObj.isLiked;
  render();
}

function handleRetweetClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isRetweeted) {
    targetTweetObj.retweets--;
  } else {
    targetTweetObj.retweets++;
  }
  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
  render();
}

/* The reply function the purpose is the ability to reply users */
function replyBackToUsersBtn(tweetId) {
  /* Fecthing the text area value */
  const reply = document.querySelector(`#input-${tweetId}`);
  /* Filtering the data out */
  const newUser = tweetsData.filter((tweet) => {
    return tweet.uuid === tweetId;
  });
  /* Essentially it's checking if tweetID matches tweetUiid and it returns a new array that's
  soley true. 
  */
  if (reply.value) {
    newUser.forEach((tweet) => {
      tweet.replies.unshift({ // We are pushing a new object to the begining of the array.
        handle: `Mohaz`,
        profilePic: `./images/Black.png`,
        likes: 0,
        retweets: 0,
        tweetText: reply.value,
        replies: [],
        isLiked: false,
        isRetweeted: false,
        uuid: uuidv4(),
      });
    });
    render(); // invoking the render function
    reply.value = ""; // Clearing the data out
  }
}

/* Removing function */
function removeTweets(tweetId) {
  /* Simaliar method it's checks if the both id not equal and if not it removes the tweet */
  tweetsData = tweetsData.filter((tweet) => {
    return tweet.uuid !== tweetId;
  });
  render();
}

function handleReplyClick(replyId) {
  /* This function  is closing and opening the reply icon*/
  document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
  document.getElementById(`chat-${replyId}`).classList.toggle("hidden");
}

function handleTweetBtnClick() {
  const tweetInput = document.getElementById("tweet-input");
  if (tweetInput.value) {
    tweetsData.unshift({
      handle: `@Mohaz`,
      profilePic: `./images/Black.png`,
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    });
    render();
    tweetInput.value = "";
  }
}

/* This function we are just retuning data and invoking render function to render the data */
function getFeedHtml() {
  let feedHtml = ``;

  tweetsData.forEach(function (tweet) {
    let likeIconClass = "";

    if (tweet.isLiked) {
      likeIconClass = "liked";
    }

    let retweetIconClass = "";

    if (tweet.isRetweeted) {
      retweetIconClass = "retweeted";
    }

    let repliesHtml = "";

    if (tweet.replies.length > 0) {
      tweet.replies.forEach(function (reply) {
        repliesHtml += `
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`;
      });
    }

    feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                <span>
                <i class="fa-solid fa-trash"  data-remove="${tweet.uuid}"></i>
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>  
    
    <div class="hidden" id="chat-${tweet.uuid}">
            <textarea class="text-input"" 
            id="input-${tweet.uuid}"
            placeholder="reply"></textarea>
            <button id="reply-btn"  data-reply-btns="${tweet.uuid}">tweet</button>
    </div>    
</div>
  

`;
  });
  return feedHtml;
}

function render() {
  document.getElementById("feed").innerHTML = getFeedHtml();
  localStorage.setItem("key", JSON.stringify(tweetsData));
}

render();

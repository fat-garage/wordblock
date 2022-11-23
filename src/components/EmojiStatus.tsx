import { useState, useEffect } from "react";
import EMOJI_ACTIVITIES from "../assets/emoji-data/emoji-group-activities.json";
import EMOJI_ANIMALS from "../assets/emoji-data/emoji-group-animals-nature.json";
import EMOJI_FLAGS from "../assets/emoji-data/emoji-group-flags.json";
import EMOJI_FOOD from "../assets/emoji-data/emoji-group-food-drink.json";
import EMOJI_OBJECTS from "../assets/emoji-data/emoji-group-objects.json";
import EMOJI_PEOPLE from "../assets/emoji-data/emoji-group-people-body.json";
import EMOJI_SMILEYS from "../assets/emoji-data/emoji-group-smileys-emotion.json";
import EMOJI_SYMBOLS from "../assets/emoji-data/emoji-group-symbols.json";
import EMOJI_TRAVEL from "../assets/emoji-data/emoji-group-travel-places.json";
// import twemoji from "twemoji";
import defaultEmoji from "../assets/img/emoji.png";
import { css } from '@emotion/react';

interface Props {
  status: string;
  setStatus: (val: string) => void;
  addVisible?: boolean;
}

const parseEmoji = (emojiList: any) => {
  return emojiList.map((item: any) => ({
    ...item,
    // twemoji: twemoji.parse(item.unicode, {}),
  }));
};

const EMOJI_GROUPS = [
  {
    name: "Smileys & People",
    emojiList: parseEmoji([
      ...EMOJI_SMILEYS.emojiList,
      ...EMOJI_PEOPLE.emojiList,
    ]),
  },
  {
    name: "Animals",
    emojiList: parseEmoji(EMOJI_ANIMALS.emojiList),
  },
  {
    name: "Food & Drink",
    emojiList: parseEmoji(EMOJI_FOOD.emojiList),
  },
  {
    name: "Activities",
    emojiList: parseEmoji(EMOJI_ACTIVITIES.emojiList),
  },
  {
    name: "Travels",
    emojiList: parseEmoji(EMOJI_TRAVEL.emojiList),
  },
  {
    name: "Objects",
    emojiList: parseEmoji(EMOJI_OBJECTS.emojiList),
  },
  {
    name: "Symbols",
    emojiList: parseEmoji(EMOJI_SYMBOLS.emojiList),
  },
  {
    name: "Flags",
    emojiList: parseEmoji(EMOJI_FLAGS.emojiList),
  },
];

function EmojiStatus({status, setStatus, addVisible}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    document.addEventListener("click", () => {
      setVisible(false);
    });
  }, [])

  useEffect(() => {
    addVisible && setStatus("");
  }, [addVisible])

  const handleClickStatus = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setVisible(!visible);
  }

  const handleSelect = (val) => {
    setStatus(val)
    setVisible(false)
  }

  return (
    <div css={styles.app}>
      <div className="set-status">
        <div className="status-wrapper" onClick={handleClickStatus}>
          {
            status ? status : <img src={defaultEmoji} />
          }
        </div>
          
          {visible && (
          <div className="emoji-container">
            {EMOJI_GROUPS.map((group) => {
              return (
                <div className="emoji-group">
                  <div className="group-name">{group.name}</div>
                  <div className="emoji-list">
                    {group.emojiList.map((emoji: any) => (
                      <div className="emoji-item" key={emoji.unicode} onClick={() => handleSelect(emoji.unicode)}>
                        <span
                          dangerouslySetInnerHTML={{ __html: emoji.unicode }}
                          className={
                            "twemoji-picker-click-emoji-" + emoji.unicode
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div onClick={() => setVisible(false)} css={styles.overlay}></div>
    </div>
  );
}

export const styles = {
  overlay: css`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  `,
  app: css`
    position: relative;
    @keyframes opacity {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
      }
    }
    .emoji-container {
      width: 300px;
      height: 212px;
      overflow: auto;
      background: #f7f7f7;
      border-radius: 8px;
      padding: 12px 4px;
      position: absolute;
      bottom: 40px;
      left: -20px;
      animation: opacity 0.2s;
      box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 10%);
    }
    
    .set-status {
      width: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
    }
    
    .status-wrapper {
      width: 20px;
      font-size: 20px;
    }
    
    .emoji-group {
      margin-bottom: 4px;
    }
    
    .group-name {
      padding: 0 0 0 8px;
    }
    
    
    .emoji-list {
      display: flex;
      flex-wrap: wrap;
    }
    
    .emoji-item {
      font-size: 24px;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-radius: 50%;
      background: f7f7f7;
      transition: all 0.3s;
    }
    
    img {
      max-width: 100%;
      transition: all 0.3s;
    }
    
    .emoji {
      width: 24px;
      height: 24px;
      background: none;
    }
    
    
    .emoji-item:hover {
      background: rgba(0, 0, 0, 0.05);
    }
    
    .emoji-item:hover img {
      transform: scale(1.1);
    }
  `
}

export default EmojiStatus;


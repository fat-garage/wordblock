
import Modal from '../../components/Modal';
import { css } from '@emotion/react';
import {useState, useRef, useEffect} from 'react';
import Message from '../../components/Message';
import AddTags from '../../components/AddTags';
import EmojiStatus from '../../components/EmojiStatus'

interface Props {
  visible: boolean;
  onCancel: () => void;
  blockData: any;
}

export default function SaveWordBlockModal({visible, onCancel, blockData}: Props) {
  const [tags, setTags] = useState([]);
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("")

  useEffect(() => {
    setTags([]);
  }, [visible])

  const handleSave = () => {
    chrome.runtime.sendMessage(
      {
        type: 'SAVE_TO_MY_WORDBLOCK',
        content: blockData.content,
        author: "Unknown",
        url: location.href,
        blockType: blockData.blockType,
        tags,
        status,
        note,
      },
      (data) => {
        if (data.type === 'SAVED') {
          Message({ content: 'Saved to Wordblock Succeessfully' });
        }
      },
    );

    onCancel()
  }

  return (
    <Modal visible={visible} onCancel={onCancel} name="SaveWordBlock">
      <div css={styles.header}>WORDBLOCK</div>

      <div css={styles.contentWrapper}>
        <div className="wb-label">{blockData.blockType === 'article' ? "Title" : "Content"}: </div>
        <div className="wb-value">{blockData.content}</div>
      </div>

      <div css={styles.contentWrapper}>
        <div className="wb-label">Tags: </div>
        <div className="wb-value">
          <AddTags tags={tags} setTags={setTags} isContent={true} />
        </div>
      </div>

      <div css={styles.contentWrapper} style={{alignItems: 'center'}}>
        <div className="wb-label">Status: </div>
        <div className="wb-value">
          <EmojiStatus status={status} setStatus={setStatus} addVisible={visible} />
        </div>
      </div>

      <div css={styles.contentWrapper} style={{alignItems: 'center'}}>
        <div className="wb-label">Note: </div>
        <div className="wb-value">
          <input value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
      </div>

      <div css={styles.saveBtn} onClick={handleSave}>Save Text Block</div>
    </Modal>
  )
}

export const styles = {
  header: css`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 40px;
    height: 50px;
    background: #fafafa;
    font-size: 16px;
    letter-spacing: 0.02rem;
    font-weight: 800;
    -webkit-text-stroke: 0.01px #000;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  `,
  contentWrapper: css`
    display: flex;
    align-items: flex-start;
    margin-top: 16px;
    padding: 0 20px;

    .wb-label {
      font-weight: bold;
      width: 66px;
    }

    .wb-value {
      flex: 1;

      input {
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        padding-left: 6px;
        height: 32px;
      }
    }
  `,
  saveBtn: css`
    border: 1px solid rgba(27,31,36,0.15);
    background: #f6f8fa;
    box-shadow:  0 1px 0 rgba(27,31,36,0.04);
    color: #0969da;
    margin: 30px auto 30px;
    font-weight: bold;
    line-height: 36px;
    border-radius: 4px;
    text-align: center;
    width: 180px;
    cursor: pointer;
  `
}
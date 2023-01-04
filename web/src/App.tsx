import { useEffect, useState, useCallback, useRef } from "react";
import "./App.less";
import { Button, Radio, Modal } from "antd";
import { getDataRequest, WordData } from "./mockData";
import InfiniteLoading from "./components/InfiniteLoading/InfiniteLoading";
import _ from "lodash";
import dayjs from "dayjs";
import logoPng from "./assets/logo.png";
import Item from "antd/es/list/Item";

function App() {
  const [list, setList] = useState<WordData[]>([]);
  const [page, setPage] = useState(1);
  const [word, setWord] = useState("");
  const [shouldReload, setShouldReload] = useState(true);
  const inputRef = useRef(null);
  const [group, setGroup] = useState("favorite");
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<WordData | null>(null)

  const getData = async (state) => {
    try {
      const { data } = await getDataRequest({
        page,
        pageSize: 10,
        word,
        group,
      });

      if (page === 1 && data.length === 0) {
        state.complete();
        return;
      }

      if (data.length < 10) {
        state.loaded();
        setTimeout(() => {
          state.complete();
        });
      } else {
        state.loaded();
      }

      setList([...data, ...list]);
      setPage(page + 1);
    } catch (_) {
      state.error();
    }
  };

  const reload = (word) => {
    setWord(word);
    setShouldReload(false);
    setList([]);
    setPage(1);

    setTimeout(() => {
      setShouldReload(true);
    });
  };

  const handleWordChange = useCallback(
    _.debounce((e) => {
      reload(e.target.value);
    }, 500),
    []
  );

  const handleSelectTag = (tag) => {
    const value = `#${tag}`;
    (inputRef as any).current.value = value;
    reload(value);
  };

  const handleGroupChange = (e) => {
    setGroup(e.target.value);
    reload((inputRef as any).current.value);
  };

  const openDetails = (item) => {
    setCurrent(item);
    setVisible(true)
  }

  return (
    <div className="app">
      <div className="fixed-header">
        <div className="header-content">
          <div className="logo-wrapper">
            <img src={logoPng} />
            <span>WORDBLOCK</span>
          </div>

          <Button type="link">SIGN IN</Button>
        </div>
      </div>
      <div className="word-container">
        <div className="search-wrapper">
          <input
            placeholder="Type To Search ..."
            onChange={handleWordChange}
            ref={inputRef}
          />

          <Radio.Group
            name="radiogroup"
            value={group}
            buttonStyle="solid"
            onChange={handleGroupChange}
          >
            <Radio value={"favorite"}>Favorite</Radio>
            <Radio value={"created"}>Created</Radio>
          </Radio.Group>
        </div>

        {shouldReload && (
          <>
            <div className="word-list">
              {list.map((item) => (
                <div className="word-item">
                  <div className="word-content" onClick={() => openDetails(item)}>
                    {item.status && (
                      <span className="status">{item.status}</span>
                    )}
                    <span dangerouslySetInnerHTML={{ __html: item.content }} />
                  </div>

                  <div className="word-desc">
                    <div className="tags-wrapper">
                      {item.tags.map((tag) => (
                        <span
                          className="tags-item"
                          onClick={() => handleSelectTag(tag)}
                        >
                          #<span dangerouslySetInnerHTML={{ __html: tag }} />
                        </span>
                      ))}
                    </div>

                    <div className="date">
                      {dayjs(item.create_at).format("YYYY-MM-DD HH:mm:ss")}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <InfiniteLoading onInfinite={getData} />
          </>
        )}
      </div>

      <Modal
        title="Wordblock"
        open={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <div className="word-details">
        <div className="details-item">
          <label>BlockID: </label>
          <span>{current?.id?.slice(0, 18)}</span>
        </div>
        <div className="details-item">
          <label>Date:</label>
          <span>{dayjs(current?.create_at).format('YYYY-MM-DD HH:mm')}</span>
        </div>
        <div className="details-item">
          <label>Url: </label>
          <span className="item-content">
            <a href={current?.url} target="_blank" rel="noreferrer">
              {current?.url}
            </a>
          </span>
        </div>
        <div className="details-item">
          <label>Author: </label>
          <span>{current?.author}</span>
        </div>
        <div className="details-item">
          <label>Tags: </label>
          <span>{current?._tags.map(item =>  `#${item} `)}</span>
        </div>
        <div className="details-item">
          <label>Status: </label>
          <span>{current?.status}</span>
        </div>
        <div className="details-item">
          <label>Note: </label>
          <span>{current?.note}</span>
        </div>
        <div className="details-item">
          <label>Type: </label>
          <span>{current?.type || 'text block'}</span>
        </div>
        <div className="details-item">
          <label>Content: </label>
          <span className="item-content">
            {current?.content}
          </span>
        </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;

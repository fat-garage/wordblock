import { Component } from "react";
import { Spin } from "antd";
import "./InfiniteLoading.less";
import defaultPng from '../../assets/default_null.png'

const STATUS = {
  READY: 0,
  LOADING: 1,
  NO_MORE: 2,
  EMPTY: 3,
  ERROR: 4,
};

interface Props {
  noMoreText?: string;
  emptyText?: string;
  onInfinite: Function;
  immediate?: boolean;
  container?: string;
}

interface State {
  status: number;
  hasData: boolean;
}

export default class InfiniteLoading extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      status: STATUS.READY,
      hasData: false,
    };
  }
  scrollParent: any;
  $state: any;

  static defaultProps = {
    noMoreText: "No More",
    emptyText: "No Data",
  };

  componentDidMount() {
    this.$state = {
      loaded: () => {
        this.setState({
          status: STATUS.READY,
          hasData: true,
        });
      },
      complete: () => {
        if (this.state.hasData) {
          this.setState({
            status: STATUS.NO_MORE,
          });
        } else {
          this.setState({
            status: STATUS.EMPTY,
          });
        }
        this.removeListener();
      },
      error: () => {
        this.setState({
          status: STATUS.ERROR,
        });
        this.removeListener();
      },
    };

    this.scrollParent = this.getScrollParent();

    setTimeout(() => {
      // 不需要出现在视窗中就加载数据
      if (this.props.immediate) {
        this.load();
      } else {
        this.handleScroll();
      }

      this.addListener();
    }, 1);
  }

  componentWillUnmount() {
    this.removeListener();
  }

  isVisible = (el) => {
    const clientHeight =
      this.scrollParent === window
        ? window.innerHeight
        : this.scrollParent.getBoundingClientRect().bottom;

    return el.getBoundingClientRect().top <= clientHeight + 10;
  };

  load = () => {
    const { status } = this.state;

    if (status === STATUS.READY) {
      this.setState({
        status: STATUS.LOADING,
      });

      this.props.onInfinite(this.$state);
    }
  };
  getScrollParent = () => {
    let el: any = window;
    if (this.props.container) {
      el = document.querySelector(this.props.container);
    }

    return el;
  };
  restore() {
    this.setState({
      status: STATUS.READY,
    });

    this.handleScroll();
    this.addListener();
  }

  handleScroll = () => {
    if (this.isVisible(this.refs.infiniteLoading)) {
      this.load();
    }
  };

  removeListener = () => {
    this.scrollParent.removeEventListener("scroll", this.handleScroll);
  };

  addListener = () => {
    this.scrollParent.addEventListener("scroll", this.handleScroll);
  };

  render() {
    const { noMoreText, emptyText } = this.props;
    const { status } = this.state;

    return (
      <div className="infinite-loading" ref="infiniteLoading">
        {status === STATUS.LOADING && (
          <div className="loading-wrapper">
            <Spin />
          </div>
        )}

        {status === STATUS.NO_MORE && (
          <div className="no-more-wrapper">
            <div className="line"></div>
            <div className="text">{noMoreText}</div>
            <div className="line"></div>
          </div>
        )}

        {status === STATUS.EMPTY && (
          <div className="empty-wrapper">
            <img src={defaultPng} />
            <div className="text">{emptyText}</div>
          </div>
        )}

        {status === STATUS.ERROR && (
          <div className="error-wrapper" onClick={this.restore}>
            <img src={defaultPng} />
            <div className="text">网络好像出错了...</div>
          </div>
        )}
      </div>
    );
  }
}

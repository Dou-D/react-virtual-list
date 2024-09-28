import { useEffect, useRef, useState } from "react";
import "./virtualList.css";

function VirtualList() {
  const itemHeight = 40;
  const [count, setCount] = useState(10);
  const [allListData, setAllListData] = useState([]);
  const [showListData, setShowListData] = useState([]);
  const [topVal, setTopVal] = useState("0");
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);
  const virtualListWrapRef = useRef(null);
  const [loading, setLoading] = useState(false);
  //   核心代码
  function handleScroll() {
    window.requestAnimationFrame(function () {
      const scrollTop = virtualListWrapRef.current?.scrollTop;
      const newStart = Math.floor(scrollTop / itemHeight);
      setStart(newStart);
      setEnd(newStart + count);
      setTopVal(scrollTop + "px");
    });
  }

  useEffect(() => {
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    setLoading(true);
    fetch("http://ashuai.work:10000/bigData", {
      method: "GET",
    }).then(async (res) => {
      await sleep(5000);
      let result = await res.json();
      setAllListData(result.data);
      // **********在这里还用不了allListData**********
      setShowListData(result.data.slice(start, end));
      setLoading(false);
    });
  }, []);
  useEffect(() => {
    setShowListData(allListData.slice(start, end));
  }, [start, end]);
  return (
    <>
      <div
        className="virtualListWrap"
        onScroll={handleScroll}
        ref={virtualListWrapRef}
        style={{ height: itemHeight * count + "px" }}
      >
        {/* 占位dom元素，其高度为所有的数据的总高度 */}
        <div
          className="placeholderDom"
          style={{ height: allListData.length * itemHeight + "px" }}
        />
        <div className="contentList" style={{ top: topVal }}>
          {showListData.map((item, index) => {
            return (
              <div
                key={index}
                className="itemClass"
                style={{ height: itemHeight + "px" }}
              >
                {item.name}
              </div>
            );
          })}
        </div>
        {/* 加载中部分 */}
        {loading && (
          <div className="loadingBox">
            <i className="el-icon-loading"></i>
            &nbsp;&nbsp;<span>loading...</span>
          </div>
        )}
      </div>
    </>
  );
}

export default VirtualList;

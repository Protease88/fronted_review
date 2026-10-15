// 使用 HashRouter：GitHub Pages 为静态托管，直接访问/刷新子路径（如 /stats）会 404，
// hash 模式不依赖服务端重写规则，配合 vite base './' 可适配任意仓库名
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Topic from './pages/Topic';
import Quiz from './quiz/Quiz';
import QuizResult from './quiz/QuizResult';
import Wrong from './quiz/Wrong';
import Stats from './quiz/Stats';
import InterviewList from './interview/InterviewList';
import InterviewDetail from './interview/InterviewDetail';
import EmptyState from './components/ui/EmptyState';
import Button from './components/ui/Button';

function NotFound() {
  return (
    <EmptyState
      mark="404"
      title="页面不存在"
      description="这个地址下没有内容，回到知识框架继续复习吧。"
      action={
        <Button as={Link} to="/" variant="secondary" size="sm">
          ← 返回知识框架
        </Button>
      }
    />
  );
}

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/k/:category/:topic" element={<Topic />} />
          <Route path="/interview" element={<InterviewList />} />
          <Route path="/interview/:id" element={<InterviewDetail />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz/result" element={<QuizResult />} />
          <Route path="/wrong" element={<Wrong />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

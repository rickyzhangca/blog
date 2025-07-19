import Scene from './components/scene-r3f';
import { Divider } from './divider';
import { Footer } from './footer';

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen max-w-[800px] flex-col border-x">
      <Scene />
      <Divider />
      <Footer />
    </div>
  );
}

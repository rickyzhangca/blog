import type { Metadata } from 'next';
import { generateMetadata as generateOGMetadata } from '@/lib/og-image';
import { ArticleLayout } from '../article-layout';
import { Image } from '../components/image';
import meta from './meta.json' with { type: 'json' };

export const metadata: Metadata = generateOGMetadata({
  title: meta.title,
  slug: 'verification-asymmetry',
  article: { ...meta, slug: 'verification-asymmetry' },
});

const VerificationAsymmetry = () => {
  return (
    <ArticleLayout>
      <h1>Verification asymmetry</h1>

      <h2>The Two-Axis Framework</h2>
      <p>
        Picture this: you're in a design review, and someone asks, "let's do
        another round." The designer smiles and has no choice. Everyone has
        opinions, but no proof. This scenario plays out thousands of times daily
        across design teams worldwide, revealing a fundamental problem in how we
        approach design work.
      </p>
      <p>
        Why do some design decisions feel impossibly subjective while others
        seem straightforward? Why do many designers struggle through stakeholder
        meetings while engineers can remain largely async? It comes down to two
        axes: how hard something is to craft, and how hard it is to verify.
      </p>
      <Image
        alt="Verification asymmetry image - 0"
        height={412}
        src="/verification-asymmetry/0.svg"
        width={734}
      />
      <p>
        Consider a login page - it's easy to craft (established patterns exist)
        and easy to verify (users either can or cannot log in). Now consider a
        brand identity - it's hard to craft (requiring deep creative work) and
        even harder to verify (many stakeholders involved, success only somewhat
        correlates to long-term market performance, which itself suffers from
        infinite colliding factors).
      </p>
      <Image
        alt="Verification asymmetry image - 1"
        height={412}
        src="/verification-asymmetry/1.svg"
        width={734}
      />
      <p>
        This difference isn't just academic - it fundamentally shapes how
        designers work, what designers value. Tackling this verification
        asymmetry is why the emergence of design engineers, not AI, is the most
        important shift in design practice today.
      </p>
      <blockquote>
        Design's core challenge isn't craft - it's verification.
      </blockquote>

      <h2>Verification Asymmetry in Design vs. Engineering</h2>
      <p>Difficulty in verification is undesirable.</p>
      <p>
        Software engineering has never been just about writing better code -
        it's also about verifying code quality. Continuous integration turns "it
        works on my machine" into "it works everywhere." Unit tests transform "I
        think this works" into "I can prove this works."
      </p>
      <Image
        alt="Verification asymmetry image - 2"
        height={412}
        src="/verification-asymmetry/2.svg"
        width={734}
      />
      <p>
        However, design lacks verification infrastructure to remove the unwanted
        difficulty.
      </p>
      <p>
        When an engineer says a feature is complete, they can point to passing
        tests, performance benchmarks, and error-free deployments. When a
        designer says a design is complete, they often can only point to
        stakeholder approval. It is a far weaker form of verification, because
        it is not based on a tangible, interactive, working product that people
        have used.
      </p>
      <Image
        alt="Verification asymmetry image - 3"
        height={412}
        src="/verification-asymmetry/3.svg"
        width={734}
      />
      <p>
        This undesirable verification gap creates compound costs, blocking
        quality and efficiency:
      </p>
      <ul>
        <li>
          Delayed decisions: Without clear verification criteria, debates drag
          on
        </li>
        <li>
          Opinion-based battles: Whoever argues loudest or has the most
          seniority wins
        </li>
        <li>
          Fear of iteration: When you can't verify improvements, change becomes
          risky
        </li>
        <li>
          Talent misallocation: Designers spend energy in meetings defending
          decisions rather than crafting
        </li>
        <li>
          Design industry challenges: Seasoned designers produce compelling
          designs with taste (a trained instinct), but students and juniors
          struggle to justify and learn from decision decisions
        </li>
      </ul>

      <h2>Mapping the Design Landscape</h2>
      <p>Let's map some common design work across our two axes:</p>
      <Image
        alt="Verification asymmetry image - 4"
        height={412}
        src="/verification-asymmetry/4.svg"
        width={734}
      />
      <p>
        Traditionally, designers derive their value and mature from tackling
        problems with increasing difficulty in either one or both axis.
      </p>
      <p>
        Notice something crucial: most design work are hard to verify and
        suffers from undesired difficulty. This is why design always feels so
        subjective and why designers often struggle to ship fast, improve
        product quality, and drive impact.
      </p>

      <h2>Design Engineer Improves Verification</h2>
      <p>
        Design engineers aren't just designers who code or developers who care
        about pixels. Their core value is improving verification practices with
        privileged information (software engineering knowledge). It makes design
        easier and faster. Here are some examples:
      </p>
      <ul>
        <li>Real prototypes</li>
        <p>
          Instead of designers only asking stakeholders "how does this new
          navigation feel to users?", design engineers work with designers to
          build it and get buy-ins. Teams can click through it. Employees can
          dogfood it.
        </p>
        <li>Performance Budgets</li>
        <p>
          That gorgeous animation might delight users - or it might bring bad
          user reviews due to lag on older devices. Together with other
          engineers, design engineers establish performance budgets that make
          these decisions explicit and back them.
        </p>
        <li>Technical Feasibility Gates</li>
        <p>
          "Can we build this? How to build this?" often comes too late. Design
          engineers surface technical constraints early, turning them into
          design opportunities rather than last-minute compromises.
        </p>
      </ul>
      <Image
        alt="Verification asymmetry image - 5"
        height={412}
        src="/verification-asymmetry/5.svg"
        width={734}
      />

      <h2>AI Disrupted Design In Unexpected Way</h2>
      <p>
        The most-used AI features by product designers - from layer renaming to
        background removal to rewriting to image gen - all target the craft
        axis. They make some craft easier but not verification - the hardest
        part of design.
      </p>
      <Image
        alt="Verification asymmetry image - 6"
        height={412}
        src="/verification-asymmetry/6.svg"
        width={734}
      />
      <p>
        This aligns with the AI’s nature. AI always excels at problems with
        clear verification criteria. AI is best at generating code that either
        passes tests or doesn't. Software engineering tasks has been made
        dramatically easier to vertify over the past decades (with lint, tests,
        containerization, metrics, …) so AI spreads out so fast for them.
      </p>
      <p>
        It explains a paradox: designer AI tools all have their hype, yet
        nothing revolutionizes design the way many imagined, let alone "replace
        designers."
      </p>
      <p>
        The above creates an interesting dynamic: product designers attempting
        to leverage AI for typical design tasks find themselves no better
        equipped. AI doesn’t spit out good UI and UX. Meanwhile, AI makes design
        engineers more powerful than ever by making code cheaper to produce, so
        they now better accelerate verification, making design easier and faster
        for their teams.
      </p>
      <blockquote>
        The most valuable and long-term disruption AI brought to design industry
        is the rise of design engineers.
      </blockquote>
      <Image
        alt="Verification asymmetry image - 7"
        height={412}
        src="/verification-asymmetry/7.svg"
        width={734}
      />
      <p>
        Some people may ask “wait, how about v0/Lovable/Bolt”? Well, they are a
        good place to start with, a quick peek into design engineering.
      </p>
      <p>
        If you found yourself in love with them, you might be interested in
        design engineering! Though the biggest value gain only starts when you
        are equipped to solve harder verification and craft without those tools.
        So don’t get addicted to cheap codes.
      </p>
      <p>
        Imagine, prototype 2 variations of layout animations for a complex,
        multi-step stock-order flow with a designer, in an existing front-end,
        ship internally, iterate based on the feedback from employees
        dogfooding.
      </p>
      <p>
        Design engineer is able to plug themselves into the existing large
        codebase, business context, and team workflow. They solve these harder
        verifications that v0 couldn’t get in yet. Craft wise, it is also a huge
        challenge to finetune animation easings and timings - beyond what v0
        could handle.
      </p>
      <Image
        alt="Verification asymmetry image - 8"
        height={412}
        src="/verification-asymmetry/8.svg"
        width={734}
      />
      <p>
        Design engineering reframes the eternal "should designers code?" debate.
        It’s on a very surface level. The actual question is:
      </p>
      <blockquote>How do we make design decisions more verifiable?</blockquote>
      <p>
        In the past, sometimes the answer is code. Sometimes it's better
        research methods. Sometimes it's new metrics. Right now in 2025, people
        are coming to an agreement that the answer is code.
      </p>

      <h2>Future</h2>
      <p>
        AI is not replacing designers any time soon, but it boosted the
        emergence of design engineers. Seasoned designers should start thinking
        about the 2 directions to advance in (optionally adding the leadership
        layer on top):
      </p>
      <ul>
        <li>
          <strong>Adventurer</strong>, focus and conquer the truly hard crafts
          and verifications - the ones that require the very best human
          creativity, empathy, and vision
        </li>
        <li>
          <strong>Architect</strong>, push the problems out from verification
          asymmetry, let other designers reach their full potential
        </li>
      </ul>
      <Image
        alt="Verification asymmetry image - 9"
        height={412}
        src="/verification-asymmetry/9.svg"
        width={734}
      />

      <h2>Kudos</h2>
      <p>
        Thanks to{' '}
        <a
          href="https://www.jw.works/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Jerry Wang
        </a>
        ,{' '}
        <a
          href="https://ryanyao.design/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Ryan Yao
        </a>
        , and{' '}
        <a
          href="https://anthonyung.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Anthony Ung
        </a>{' '}
        for reviewing this article, and the design engineering team at{' '}
        <a
          href="https://wealthsimple.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Wealthsimple
        </a>{' '}
        for inspirations.
      </p>
    </ArticleLayout>
  );
};

export default VerificationAsymmetry;

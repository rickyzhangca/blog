import Link from 'next/link';

export const BackButton = () => {
  return (
    <Link
      className="flex items-center justify-center border bg-white px-4 py-3 text-foreground"
      href="/"
    >
      Back
    </Link>
  );
};

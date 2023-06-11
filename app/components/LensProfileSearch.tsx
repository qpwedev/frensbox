import Link from "next/link";

type LensProfileSearchProps = {
  searchInput: string;
  handleSearchChange: (event: any) => void;
  handleSearchSubmit: (event: any) => void;
};

export default function LensProfileSearch({
  searchInput,
  handleSearchChange,
  handleSearchSubmit,
}: LensProfileSearchProps) {
  return (
    <form onSubmit={handleSearchSubmit}>
      <input
        type="text"
        value={searchInput}
        onChange={handleSearchChange}
        placeholder="Search profiles"
        className="mt-2 px-4 py-2 bg-white text-black rounded"
      />
      {searchInput && (
        <Link href={`/profile/${searchInput}.lens`}>
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-white text-black rounded"
          >
            Go
          </button>
        </Link>
      )}
    </form>
  );
}

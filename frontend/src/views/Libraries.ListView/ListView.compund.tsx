import React, { useEffect, useState } from 'react';
import { Library } from 'src/@types';
import LibraryFactory from 'src/mocks/libraryFactory';
import LibrariesListViewComp from './ListView';

const LibrariesListView: React.FC = () => {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLibraries = async () => {
    setIsLoading(true);

    const result = LibraryFactory.buildList(5);

    setLibraries(result);

    setIsLoading(false);
  };

  useEffect(() => {
    fetchLibraries();
  }, []);

  return (
    <LibrariesListViewComp libraries={libraries} isLoading={isLoading} />
  );
};

export default LibrariesListView;

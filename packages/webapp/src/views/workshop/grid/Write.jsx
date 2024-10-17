import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
const Write = () => {
  const [comment, setComment] = useState('');
  const classNames = (...classes) => {
    const classNamesString = classes.filter(Boolean).join(' ');
    return classNamesString;
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  return (
    <form action="#">
      <Tab.Group>
        <Tab.List className="flex items-center">
          <Tab
            className={({ selected }) =>
              classNames(
                selected
                  ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-900',
                'rounded-md border border-transparent px-3 py-1.5 text-sm font-medium'
              )
            }
          >
            Write
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                selected
                  ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-900',
                'ml-2 rounded-md border border-transparent px-3 py-1.5 text-sm font-medium'
              )
            }
          >
            Preview
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel className="-m-0.5 rounded-lg p-0.5">
            <label htmlFor="comment" className="sr-only">
              Comment
            </label>
            <div>
              <textarea
                rows={5}
                name="comment"
                id="comment"
                className="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-800 placeholder:text-red-600 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                placeholder="Add your comment..."
                value={comment}
                onChange={handleCommentChange}
              />
            </div>
          </Tab.Panel>
          <Tab.Panel className="-m-0.5 rounded-lg p-0.5">
            <div>
              <label htmlFor="preview" className="sr-only">
                Preview
              </label>
              {comment && (
                <div
                  id="preview"
                  className="border-b mx-px mt-px px-3 pb-12 pt-2 text-sm leading-5 text-red-600"
                >
                  {comment}
                </div>
              )}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </form>
  );
};

export default Write;
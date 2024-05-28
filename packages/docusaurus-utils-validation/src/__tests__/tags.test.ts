/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {ensureUniquePermalinks, normalizeTags} from '../../lib/tags';
import type {TagsFile, TagsFileInput} from '@docusaurus/utils';

describe('ensureUniquePermalinks', () => {
  it('throw when one duplicate permalink found', () => {
    const definedTags: TagsFile = {
      open: {
        label: 'Open Source',
        permalink: '/custom-open-source',
        description: 'Learn about the open source',
      },
      closed: {
        label: 'Closed Source',
        permalink: '/custom-open-source',
        description: 'Learn about the closed source',
      },
    };

    expect(() =>
      ensureUniquePermalinks(definedTags),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Duplicate permalinks found: /custom-open-source"`,
    );
  });

  it('throw when multiple duplicate permalink found', () => {
    const definedTags: TagsFile = {
      open: {
        label: 'Open Source',
        permalink: '/custom-open-source',
        description: 'Learn about the open source',
      },
      closed: {
        label: 'Closed Source',
        permalink: '/custom-open-source',
        description: 'Learn about the closed source',
      },
      hello: {
        label: 'Hello',
        permalink: '/hello',
        description: 'Learn about the hello',
      },
      world: {
        label: 'Hello',
        permalink: '/hello',
        description: 'Learn about the world',
      },
    };

    expect(() =>
      ensureUniquePermalinks(definedTags),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Duplicate permalinks found: /custom-open-source, /hello"`,
    );
  });

  it('do not throw when no duplicate permalink found', () => {
    const definedTags: TagsFile = {
      open: {
        label: 'Open Source',
        permalink: '/open-source',
        description: 'Learn about the open source',
      },
      closed: {
        label: 'Closed Source',
        permalink: '/closed-source',
        description: 'Learn about the closed source',
      },
    };

    expect(() => ensureUniquePermalinks(definedTags)).not.toThrow();
  });
});

describe('normalizeTags', () => {
  it('normalize null tag', () => {
    const input: TagsFileInput = {
      'kebab case test': null,
    };

    const expectedOutput = {
      'kebab case test': {
        description: 'kebab case test default description',
        label: 'Kebab case test',
        permalink: '/kebab-case-test',
      },
    };

    expect(normalizeTags(input)).toEqual(expectedOutput);
  });

  it('normalize partial tag with label', () => {
    const input: TagsFileInput = {
      world: {label: 'WORLD'},
    };

    const expectedOutput = {
      world: {
        description: 'world default description',
        label: 'WORLD',
        permalink: '/world',
      },
    };

    expect(normalizeTags(input)).toEqual(expectedOutput);
  });

  it('normalize partial tag with description', () => {
    const input: TagsFileInput = {
      world: {description: 'World description test'},
    };

    const expectedOutput = {
      world: {
        description: 'World description test',
        label: 'World',
        permalink: '/world',
      },
    };

    expect(normalizeTags(input)).toEqual(expectedOutput);
  });

  it('normalize partial tag with permalink', () => {
    const input: TagsFileInput = {
      world: {permalink: 'world'},
    };

    const expectedOutput = {
      world: {
        description: 'world default description',
        label: 'World',
        permalink: 'world',
      },
    };

    expect(normalizeTags(input)).toEqual(expectedOutput);
  });

  it('does not modify fully defined tags', () => {
    const input = {
      tag1: {
        label: 'Custom Label',
        description: 'Custom Description',
        permalink: 'custom-permalink',
      },
    };

    expect(normalizeTags(input)).toEqual(input);
  });

  it('handle special characters in keys', () => {
    const input = {
      'special@char$!key': null,
    };

    const expectedOutput = {
      'special@char$!key': {
        description: 'special@char$!key default description',
        label: 'Special@char$!key',
        permalink: '/special-char-key',
      },
    };

    expect(normalizeTags(input)).toEqual(expectedOutput);
  });

  it('handle special characters in keys with chinese characters', () => {
    const input = {
      特殊字符测试: null,
    };

    const expectedOutput = {
      特殊字符测试: {
        description: '特殊字符测试 default description',
        label: '特殊字符测试',
        permalink: '/特殊字符测试',
      },
    };

    expect(normalizeTags(input)).toEqual(expectedOutput);
  });

  it('normalize test', () => {
    const input: TagsFileInput = {
      world: {permalink: 'aze'},
      hello: {permalink: 'h e l l o'},
    };

    const expectedOutput = {
      world: {
        description: 'world default description',
        label: 'World',
        permalink: 'aze',
      },
      hello: {
        description: 'hello default description',
        label: 'Hello',
        permalink: 'h-e-l-l-o',
      },
    };

    expect(normalizeTags(input)).toEqual(expectedOutput);
  });
});
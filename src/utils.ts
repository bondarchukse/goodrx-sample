const dotenv = require('dotenv');
import { ContentType, PageContainerEntry, PageHealthEntry, PageItem, PageType } from './typings';
import * as contentful from 'contentful';
import { map } from 'lodash';

dotenv.config();

const GOOD_RX_SPACE_ID=process.env.GOOD_RX_SPACE_ID;
const GOOD_RX_TOKEN=process.env.GOOD_RX_TOKEN;

export const createClient = (): contentful.ContentfulClientApi => {
  return contentful.createClient({
    accessToken: GOOD_RX_TOKEN,
    space: GOOD_RX_SPACE_ID
  });
}

export const getConditionsFromPageContainer = async (client: contentful.ContentfulClientApi, ids?: Array<string>) => {
  const select = [
    'fields.pageMeta',
    'fields.slug',
    'fields.pageType',
    'sys.contentType',
    'sys.id',
  ];

  const query: Record<string, unknown> = {
    'content_type': ContentType.PageContainer,
    'fields.pageType': PageType.HealthConditionHub,
    select: String(select),
    include: 1,
    skip: 0,
    limit: 1000
  }

  if (ids) {
    query['sys.id[in]'] = String(ids);
  }

  const { items } = await client.getEntries(query);

  return map(items, createPageItemFromContainerPages);
}

export const getConditionsFromHealthPages = async (client: contentful.ContentfulClientApi, ids?: Array<string>) => {
  const select = [
    'fields.pageMetaJsonField',
    'fields.slug',
    'fields.path',
    'fields.pageType',
    'fields.featuredImage',
    'sys.contentType',
    'sys.id',
  ];

  const query: Record<string, unknown> = {
    'content_type': ContentType.HealthPage,
    'fields.pageType': PageType.Hub,
    'fields.parent' : "conditions",
    select: String(select),
    include: 1,
    skip: 0,
    limit: 1000
  };

  if (ids) {
    query['sys.id[in]'] = String(ids);
  }

  const { items } = await client.getEntries(query);

  return map(items, createPageItemFromHealthPage);
}

export const getRelatedArticles = async (client: contentful.ContentfulClientApi, slug: string) => {
  const select = [
    'fields.pageMetaJsonField',
    'fields.slug',
    'fields.path',
    'fields.pageType',
    'fields.featuredImage',
    'sys.contentType',
    'sys.id',
  ];

  const query: Record<string, unknown> = {
    limit: 1000,
    skip: 0,
    content_type: ContentType.HealthPage,
    include: 1,
    select,
    'fields.conditionFacet': slug,
    'fields.pageType': PageType.Article,
  };

  const { items } = await client.getEntries(query);

  return map(items, createPageItemFromHealthPage);
}

export const createPageItemFromContainerPages = ({ fields, sys }: PageContainerEntry): PageItem => {
  const { pageMeta: { fields: { image, input } } , pageType, slug } = fields;
  const { contentType, id } = sys;
  return {
    id,
    contentType: contentType.sys.id,
    pageType,
    url: `https://goodrx.com/${slug}`,
    title: input.TITLE,
    description: input.DESCRIPTION,
    conditionName: input.CONDITION_NAME,
    imageUrl: image ? `https:${image.fields.file.url}` : null,
    slug,
  }
}

export const createPageItemFromHealthPage = ({ fields, sys }: PageHealthEntry): PageItem => {
  const { pageType, path, pageMetaJsonField, featuredImage, slug } = fields;
  const { contentType, id } = sys;
  return {
    id,
    contentType: contentType.sys.id,
    pageType,
    url: `https://goodrx.com${path}`,
    title: pageMetaJsonField.TITLE,
    description: pageMetaJsonField.DESCRIPTION,
    conditionName: pageMetaJsonField.CONDITION_NAME,
    imageUrl: featuredImage ? `https:${featuredImage.fields.file.url}` : null,
    slug,
  }
}



export enum PageType {
  HealthConditionHub = "health condition hub",
  Hub = "hub",
  Article = "article"
}

export enum ContentType {
  PageContainer = 'pageContainer',
  HealthPage = 'healthPage'
}

export interface Image {
  fields: {
    title : string;
    description : string;
    file: {
      url: string;
      fileName: string;
      contentType: string;
    }
  }
}

export interface PageMeta {
  fields: {
    image: Image;
    input: {
      TITLE: string;
      DESCRIPTION: string;
      CONDITION_NAME: string;
    }
  }
}

export interface PageContainerEntry {
  fields: {
    pageMeta: PageMeta;
    slug: "heart-health"
    pageType: PageType;
  },
  sys: {
    id: string;
    contentType: {
      sys: {
        id : ContentType
      }
    }
  }
}

export interface PageHealthEntry {
  fields: {
    pageMetaJsonField: {
      TITLE: string;
      DESCRIPTION: string;
      ALTERNATE_NAME: string;
      CONDITION_NAME: string;
      ANATOMICAL_STRUCTURE: string;
    },
    slug: string;
    path: string;
    pageType: PageType;
    featuredImage: Image;
  },
  sys: {
    id: string;
    contentType: {
      sys: {
        id : ContentType
      }
    }
  }
}


export interface PageItem {
  id: string;
  url: string;
  pageType: PageType;
  contentType: ContentType;
  title: string;
  description: string;
  conditionName: string;
  imageUrl: string;
  slug: string;
}

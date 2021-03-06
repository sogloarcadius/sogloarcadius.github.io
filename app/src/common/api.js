
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { BIOGRAPHY_API_URL, PROJECTS_API_URL} from '@/common/config'

import { Cache, cacheAdapterEnhancer, throttleAdapterEnhancer } from 'axios-extensions';


var localeCaches = new Object();
localeCaches.en = new Cache();
localeCaches.fr = new Cache();
localeCaches.es = new Cache();

export const BaseApi = {

  init () {
    Vue.use(VueAxios, axios);
    Vue.axios.defaults.adapter = throttleAdapterEnhancer(cacheAdapterEnhancer(Vue.axios.defaults.adapter));
  },

  setUrl(base_url) {
    Vue.axios.defaults.baseURL = base_url;
  },

  setLocale(locale){
    Vue.axios.defaults.headers.common['Accept-Language'] = locale;
  },

  setHeaders () {
    Vue.axios.defaults.headers.common['Cache-Control'] = 'no-cache';
  },

  query (locale, resource, params) {
    return Vue.axios
      .get(resource, params, {cache: localeCaches[locale]})
      .catch((error) => {
        throw new Error(`[portfolio] BaseApi ${error}`)
      })
  },

  get (locale, resource, slug = '') {
    return Vue.axios
      .get(`${resource}/${slug}`, {cache: localeCaches[locale]})
      .catch((error) => {
        throw new Error(`[portfolio] BaseApi ${error}`)
      })
  },

  post (resource, params) {
    return Vue.axios.post(`${resource}`, params)
  },

  update (resource, slug, params) {
    return Vue.axios.put(`${resource}/${slug}`, params)
  },

  put (resource, params) {
    return Vue.axios
      .put(`${resource}`, params)
  },

  delete (resource) {
    return Vue.axios
      .delete(resource)
      .catch((error) => {
        throw new Error(`[portfolio] BaseApi ${error}`)
      })
  }
}



export const BiographyService = {

    init(){
      BaseApi.init();
      BaseApi.setUrl(BIOGRAPHY_API_URL);
      BaseApi.setHeaders();
    },

    about(locale){
      BaseApi.setLocale(locale);
      return BaseApi.get(locale, "api/resume", 'biography');
    },
}



export const ProjectService = {

  init(){
    BaseApi.init();
    BaseApi.setUrl(PROJECTS_API_URL);
    BaseApi.setHeaders();
  },

  projects(locale){
    BaseApi.setLocale(locale);
    return BaseApi.get(locale, "api", 'projects');
  },

}
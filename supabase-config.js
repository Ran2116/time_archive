
const SUPABASE_URL = 'https://hjdarqtlgyifudpgohpf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqZGFycXRsZ3lpZnVkcGdvaHBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5ODY0NzcsImV4cCI6MjA5MzU2MjQ3N30.oq5EJewOwoft4QCRIL-Bp4X4ZLVoCOc0eB0OMO_Mp4o';

const _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


function rowToSpec(row) {
  return {
    id: row.id,
    catalog: row.catalog,
    type: row.type,
    kind: row.kind,
    title: row.title,
    description: row.description,
    color: row.color,
    image: row.image_url,
    duration: row.duration ? Number(row.duration) : null,
    startAt: row.start_at ? Number(row.start_at) : null,
    createdAt: row.created_at ? new Date(row.created_at).getTime() : null,
  };
}

function specToRow(spec) {
  return {
    id: spec.id,
    catalog: spec.catalog,
    type: spec.type,
    kind: spec.kind,
    title: spec.title,
    description: spec.description,
    color: spec.color,
    image_url: spec.image,
    duration: spec.duration,
    start_at: spec.startAt,
  };
}


window.TA_DB = {
 
  async getAllSpecimens() {
    const { data, error } = await _supabase
      .from('specimens')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) { console.error('getAllSpecimens:', error); return []; }
    return data.map(rowToSpec);
  },

 
  async getSpecimen(id) {
    const { data, error } = await _supabase
      .from('specimens')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) { console.error('getSpecimen:', error); return null; }
    return rowToSpec(data);
  },

  
  async uploadImage(file, id) {
    const ext = (file.name.split('.').pop() || 'png').toLowerCase();
    const filename = id + '.' + ext;
    const { error } = await _supabase.storage
      .from('specimen-images')
      .upload(filename, file, { contentType: file.type });
    if (error) { console.error('uploadImage:', error); throw error; }
    const { data } = _supabase.storage
      .from('specimen-images')
      .getPublicUrl(filename);
    return data.publicUrl;
  },

  
  async saveSpecimen(spec) {
    const row = specToRow(spec);
    const { data, error } = await _supabase
      .from('specimens')
      .insert(row)
      .select()
      .single();
    if (error) throw error;
    return rowToSpec(data);
  },

 
  async deleteSpecimen(id) {
    const spec = await this.getSpecimen(id);
    if (spec && spec.image) {
      const filename = spec.image.split('/').pop();
      await _supabase.storage.from('specimen-images').remove([filename]);
    }
    const { error } = await _supabase.from('specimens').delete().eq('id', id);
    if (error) throw error;
  },
};


get '/lib/*' do |path|
  send_file File.dirname(__FILE__) + '/../lib/' + path
end
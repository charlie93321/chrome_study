import  requests

resp=requests.post('http://localhost:19998/sendData',{'id':'1001'});
print(resp.text)
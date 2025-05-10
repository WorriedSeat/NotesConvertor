from tortoise import Model, fields

class Task(Model):
    class Meta:
        table = 'task'
        
    id = fields.IntField(pk=True)
    img_path = fields.TextField()
    result_text = fields.TextField(null=True)
    created_at = fields.DatetimeField(auto_now_add = True, null=False)
    

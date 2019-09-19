using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Task1CRUD.Models
{
    public partial class Sales
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int CustomerId { get; set; }
        public int StoreId { get; set; }

        [DataType(DataType.Date)]
        public DateTime DateSold { get; set; }

        public virtual Customer Customer { get; set; }
        public virtual Product Product { get; set; }
        public virtual Store Store { get; set; }
    }
}
